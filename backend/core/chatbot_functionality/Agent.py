import ollama
import json

#Defines a agent. Role, goal, additional info, are text that contribute to a starting prompt
#Engine specifies the engine used: ie ollama or openai
#context base stores any context for the agent, ie stored papers. refers to a KnowledgeBase obj(in KnowledgeBase.py). Refer to documentation there
#memory_base stores conversation info. also refers to a KnowledgeBase obj.

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
    def to_string(self, incl_goal=False):
        if (incl_goal):
            return f"ROLE: {self.role}\nEXPERTISE: {self.expertise}\nGOAL: {self.goal}"
        else:
            return f"ROLE: {self.role}\nEXPERTISE: {self.expertise}"
    #alternate version of answer_query for use in conversation where conversation call chatcompletion. Does not make any api calls
        #instead jsut returns relevant info to the conversation obj
    def get_self_knowledge(self, query, query_kb, vectors):
        relevant_knowledge=""
        if (self.memory_base != None and self.memory_base.id_counter != 0 and query_kb != False):
            relevant_knowledge = "Relevant knowledge: \n"
            knowledge_vectors_dict = self.memory_base.query_knowledge(query, vectors)
            
            for src, content in knowledge_vectors_dict.items():
                one_vector = f"{src}: {content}"
                relevant_knowledge = relevant_knowledge + one_vector + '\n'

        return {"role":self.role, "goal":self.goal, "expertise":self.expertise, "relevant_knowledge":relevant_knowledge}
        
