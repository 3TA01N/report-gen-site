import ollama
import json
import tiktoken


from openai import OpenAI
import os
from dotenv import load_dotenv

if os.getenv('RENDER') is None:
    load_dotenv('.env.local')

class openai_engine:
    def __init__(self, model):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.model = model
    def to_string(self):
        print("openai", self.model)
    #chat completion: takes in the chatlog and answeres the query given format
    def chat_complete(self, chatlog, temperature):
        
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=chatlog,
            temperature=temperature,
        )
        #print(completion)
        input_tokens = completion.usage.completion_tokens
        output_tokens = completion.usage.prompt_tokens
        
        return {"output": completion.choices[0].message.content, "tokens": [input_tokens, output_tokens]}


    #this is only used for formatted responses now. 
    def generate(self, query, format):
        encoding = tiktoken.encoding_for_model("gpt-4o-mini")
        tokens = encoding.encode(query)
        #print("TOKEN LENGTH FOR QUERY:", len(tokens))
        
        if format == {}:
            return "Format must not be empty"
        else:
            response = self.client.responses.create(
                model=self.model,
                input=query,
                text = format
            )
        #print("FULL RESPONSE TEXT:", response.output_text)
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
        return {"output":response.output_text, "tokens":[input_tokens, output_tokens]}
    
#Defines a ollama engine.
class ollama_engine:
    def __init__(self, model):
        self.model = model
        self.chat_log = []
        

    def to_string(self):
        print("Ollama", self.model)
    #Generates a one time answer to a query(response not stored)
    def generate(self, query, format):
        ollama.pull(self.model)
        if format == {}:
            response = ollama.generate(model=self.model, prompt=query)
            reply = response['response']
        else:
            response = ollama.generate(model=self.model, prompt=query, format=format.model_json_schema())
            reply = format.model_validate_json(response['response'])
        return reply
   
   
   
    #Generates an answer to a query. Stores the interaction in chat_log.
    def chat(self, query):
        ollama.pull(self.model)
        response = ollama.chat(model=self.model, messages=self.chat_log + [{"role": "user", "content": query}])
        
        reply = response['message']['content']
        
        # Append the current interaction to the chat log
        self.chat_log.append({"role": "user", "content": query})
        self.chat_log.append({"role": "assistant", "content": reply})

        return reply

    def clear_chat(self):
        self.chat_log = []
