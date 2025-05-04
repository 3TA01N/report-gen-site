import ollama
import json

class Agent:
    def __init__(self, role, expertise, engine=None,memory=None, kb_path=None):
        self.role = role
        self.goal = ""
        self.expertise= expertise
        self.engine = engine
        self.memory_base = memory
        self.kb_path = kb_path
        self.additonal_context= ""
    def set_memory(self, kb):
        self.memory_base = kb
    def set_additional_context(self, additonal_context):#Used to set additional TEXT context for an agent, ie, for a lead, the info about all other agent
        self.additonal_context = additonal_context
    def set_goal(self, goal):
        self.goal = goal

    def set_engine(self, engine):
        self.engine = engine
    def to_string(self, incl_goal=False):
        if (incl_goal):
            return f"ROLE: {self.role}\nEXPERTISE: {self.expertise}\nGOAL: {self.goal}"
        else:
            return f"ROLE: {self.role}\nEXPERTISE: {self.expertise}"
    #used when using openai chatcomplete: needs the context
    def get_self_knowledge(self, query, query_kb, vectors):
        relevant_knowledge=""
        if (self.memory_base != None and self.memory_base.id_counter != 0 and query_kb != False):
            relevant_knowledge = "Relevant knowledge: \n"
            knowledge_vectors_dict = self.memory_base.query_knowledge(query, vectors)
            
            for src, content in knowledge_vectors_dict.items():
                one_vector = f"{src}: {content}"
                relevant_knowledge = relevant_knowledge + one_vector + '\n'

        return {"role":self.role, "goal":self.goal, "expertise":self.expertise, "relevant_knowledge":relevant_knowledge}
        

    #given a query, compile relevant context from context_base and memory_base, as well as agent parameters(role, goal, etc)
    #into a prompt that can be passed to the engine.
    def answer_query(self, query, chat_log, query_kb, vectors, format, debug_log=False):

        #Check id counter(means no papers been uploaded yet)
        relevant_context = ""
        relevant_knowledge=""
        if (self.memory_base != None and self.memory_base.id_counter != 0 and query_kb != False):
            relevant_knowledge = "Relevant memories: \n"
            knowledge_vectors_dict = self.memory_base.query_knowledge(query, vectors)
            
            for src, content in knowledge_vectors_dict.items():
                one_vector = f"{src}: {content}"
                relevant_knowledge = relevant_knowledge + one_vector + '\n'
        else :
            print("KB empty/query_kb false")
        
        if (chat_log != ""):
            history = f"Chat history:\n{chat_log}"
        else:
            history=""

        prompt = f"""
                role: 
                {self.role}

                goal: 
                {self.goal}

                expertise: 
                {self.expertise}

                {history}

                {relevant_knowledge}

                {relevant_context}

                {self.additonal_context}
                Instructions: 
                {query}

                 """
        
        if (debug_log == True):
            print("Full prompt passed to agent:", prompt)
        output, tokens = engine.generate(prompt, format)
        #timestamp = datetime.now().time()

        return output, tokens#, relevant_knowledge, timestamp

