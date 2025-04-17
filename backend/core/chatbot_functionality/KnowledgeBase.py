import ollama
import os
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from .constants import embedders_dict
from langchain_text_splitters import RecursiveCharacterTextSplitter
import json
from pdfminer.high_level import extract_text
import shutil
import faiss
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_community.docstore.in_memory import InMemoryDocstore
import uuid
from django.conf import settings

import numpy as np
import re
import boto3


"""Knowledge base class: an interface to interact with a local FAISS knowledge base.
 """


#Creates the folder, as well as id_counter local storage
def instantiate_empty_vector_store(path, embedder, embedder_name):
    
    index = faiss.IndexFlatL2(len(embedder.embed_query("hello world")))
        
    empty_vector_store = FAISS(
        embedding_function=embedder,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )
    
    empty_vector_store.save_local(path)

    with open(f"""{path}/id_counter.txt""", "w") as file:
        file.write("0")
        file.close()

    with open(f"""{path}/info.txt""", "w") as file:
        file.write(f"{embedder_name}\n")
        file.close()

class s3Interface():
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name

        self.s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                         aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION)
    
    def read_file(self, remote_path):
        try:
            
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=remote_path)
            content_type = response.get("ContentType")
            content=""
            if "txt" in content_type or "text" in content_type:
                content = response['Body'].read().decode('utf-8')
            elif "pdf" in content_type:
                with open('temppdf', 'wb+') as destination:
                    destination.write(response['Body'].read())

                content = extract_text('temppdf')
                os.remove('temppdf')
            else:
                return "on type, unexpected err"

            return content
        
        except self.s3_client.exceptions.NoSuchKey:
            raise FileNotFoundError(f"The file '{remote_path}' does not exist in the bucket '{self.bucket_name}'.")
        except Exception as e:
            raise Exception(f"Error reading file '{remote_path}': {e}")
        
    def delete_folder(self, remote_folder):
        response = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=remote_folder)

        if 'Contents' in response:
            delete_keys = [{'Key': obj['Key']} for obj in response['Contents']]
            self.s3_client.delete_objects(
                Bucket=self.bucket_name,
                Delete={'Objects': delete_keys}
            )

    def close_s3(self, remote_folder, local_folder):
        for root, dirs, files in os.walk(local_folder):
            for file in files:
                local_path = os.path.join(root, file)
                relative_path = os.path.relpath(local_path, local_folder)
                s3_key = os.path.join(remote_folder, relative_path).replace("\\", "/")

                self.s3_client.upload_file(local_path, self.bucket_name, s3_key)
        shutil.rmtree(local_folder)
        
    #saves the remote folder from s3 into the destination path
    def open_s3(self, remote_folder,destination_path):

        paginator = self.s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=self.bucket_name, Prefix=remote_folder)
            
        for page in pages:
            for obj in page.get('Contents', []):
                s3_key = obj['Key']
                rel_path = os.path.relpath(s3_key, remote_folder)
                local_path = os.path.join(destination_path, rel_path)

                # Create local directory if it doesn't exist
                os.makedirs(os.path.dirname(local_path), exist_ok=True)

                print(f"Downloading {s3_key} → {local_path}")
                self.s3_client.download_file(self.bucket_name, s3_key, local_path)



#id_counter.txt stores the current vector id(primitive solution allowing us to access vector by id later, will find more elegant solution)
class KnowledgeBase():
    #inits instant of knowledge base with the vector store at the given path, and sets id counter to the current highest id counter in the vector store
    def __init__(self, vector_store_location, embedder_name):
        self.vector_store_location = vector_store_location
        self.embedder = embedders_dict[embedder_name]

        if not os.path.exists(vector_store_location):
            instantiate_empty_vector_store(vector_store_location, embedder=self.embedder, embedder_name=embedder_name)
            
        
        with open(f"""{vector_store_location}/id_counter.txt""", "r") as file:
            self.id_counter = int(file.read())
        
        
        self.cur_vector_store = FAISS.load_local(self.vector_store_location, self.embedder, allow_dangerous_deserialization=True)
        self.dimension = self.cur_vector_store.index.d

    @classmethod
    def from_path(cls, path):
        infofile_content_pt = open(os.path.join(path, "info.txt"))
        infofile_content = [line.rstrip() for line in infofile_content_pt]
        infofile_content_pt.close()

        #string parse here
        #Have a dictionary that will map:
        #Embedder_name to embedder
        
        embedder_name = infofile_content[0]
        embedder = embedders_dict[embedder_name]
        return cls(vector_store_location = path, embedder_name = embedder_name)

    #SECOND DEF INIT: ONLY TAKES A LOCATION
    #HAVE A FILE IN KB ROOT CONTAINING INFO: EMBEDDER
    def update_local_vector_store(self):
        self.cur_vector_store = FAISS.load_local(self.vector_store_location, self.embedder, allow_dangerous_deserialization=True)


    #Resets the vector store at the path defined in the knowledge base intit. 

    def reset_knowledge_base(self):
        self.id_counter = 0
        with open(f"""{self.vector_store_location}/id_counter.txt""", "w") as file:
            file.write("0")
        
        index = faiss.IndexFlatL2(len(self.embedder.embed_query("hello world")))
        
        self.cur_vector_store = FAISS(
                embedding_function=self.embedder,
                index=index,
                docstore=InMemoryDocstore(),
                index_to_docstore_id={},
            )
        
        self.cur_vector_store.save_local(self.vector_store_location)
        del self.cur_vector_store
        self.update_local_vector_store()
    
    #Chunks a piece of text using a provided text splitter
    def chunk_text(self, text, text_splitter):
        chunks = text_splitter.create_documents(text)
        return chunks
    
    #Given a series of documents(chunks returned by text splitter), embed the documents.
    #
    def embed_data(self, documents, ids): 
        embedder = HuggingFaceEmbeddings()
        index = faiss.IndexFlatL2(len(embedder.embed_query("hello world")))
        
        vector_store = FAISS(
            embedding_function=embedder,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

        vector_store.add_documents(documents=documents, ids=ids)
        self.cur_vector_store.merge_from(vector_store)
        #merge with local storage
        self.cur_vector_store.save_local(self.vector_store_location)
        
    #Given a query, return num_vectors amount of context vectors(decoded) that are relevant to the query
    def query_knowledge(self, query, num_vectors):
        embedder = HuggingFaceEmbeddings()
        cur_vector_store = FAISS.load_local(self.vector_store_location, embedder, allow_dangerous_deserialization=True)
        retriever = cur_vector_store.as_retriever(search_type="similarity", search_kwargs={"k":num_vectors})

        retrieved_docs = retriever.invoke(query)



        docs_dict = {}
        for i in retrieved_docs:
            page_content = i.page_content
            id = page_content[3:page_content.find('#')]
            #parse the content str
            src = i.metadata['source']
            content_str = i.page_content
            match = re.search(r"page_content='(.*?)'", content_str)
            parsed_content = ""
            if match:
                parsed_content = match.group(1)
                print(parsed_content)
            
            docs_dict[src] = parsed_content
        print("returned vectors in dict form:", docs_dict)
        return (docs_dict)
            #self.engine.chat(query)
    

        #Weakens a vector by amount
    #EXPERIEMENTAL: gets a vector from the vector store by it's unique id
    def vector_from_id(self, id):
        self.update_local_vector_store()
        doc_id = self.cur_vector_store.index_to_docstore_id[id]
        document = self.cur_vector_store.docstore.search(doc_id)
        return document

    #Embeds a single vector to the curretn vector store.
    def add_vector(self, page_content, metadata):
        id = [self.id_counter]
        doc = Document(
            page_content=f"id:{self.id_counter}#\n" + page_content,
            metadata={"timestamp":metadata},
        )
        vector = []
        vector.append(doc)
        
        self.id_counter+=1
        with open(f"""{self.vector_store_location}/id_counter.txt""", "w") as file:
            file.write(str(self.id_counter))

        self.embed_data(vector, id)   
         
    """Given a text and a chunker, text is divided into chunks. Each chunk is embedded, assigned a unique id, and added to the vector store."""
    def upload_knowledge_1(self, text, source_name, chunker):
            
            vector_docs = []
            print("CHUNKING TEXT:")
            chunks = self.chunk_text(text, chunker)
            print("TEXT CHUNKED")
            
            for i in chunks:
                
                raw_info = str(i)
                #print("Chunking", raw_info)
                append_doc = Document(
                    page_content= raw_info,
                    metadata={"source": source_name}
                )
                print(append_doc)
                vector_docs.append(append_doc)
            

            
            #generate unique int id
            ids = []
            for i in range(len(vector_docs)):
                ids.append(self.id_counter)
                self.id_counter +=1

            with open(f"""{self.vector_store_location}/id_counter.txt""", "w") as file:
                file.write(str(self.id_counter))
            #uuids = [str(uuid.uuid4()) for _ in range(len(vector_docs))]

            for id, doc in zip(ids, vector_docs):
                 doc.page_content = f"id:{id}#\n" + doc.page_content

            self.embed_data(vector_docs, ids)


