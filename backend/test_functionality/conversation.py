import json
class Conversation:
    #this conversation class: main point is that a starting task is intialized.
    #Further conversation throuhg convo_prompt continues it.
    def __init__(self, team, start_prompt, engine):
        #start prompt should contain stuff like the overall goal of the conversation, 
        #who is in the conversaiton, guiding q, etc
        self.chat_log = []
        self.chat_log.append({"role": "system", "content": start_prompt})
        self.engine = engine
        self.team = team
        self.input_token_total = 0
        self.output_token_total = 0

    def reset_chat(self):
        self.chat_log = []
    def to_string(self):
        print("Team:")
        names = ", ".join(name.lower() for name in self.team.keys())
        print(names)
        print("Engine:")
        print(self.engine.to_string())

    """def chat_log_to_string(self):
        return "\n".join(json.dumps(item, indent=1) if isinstance(item, dict) else str(item) for item in self.chat_log)
    """
    def convo_prompt(self, prompt, agent_name, draw_from_knowledge):
        #Prompt should be something like , "lead, kick off conversation"
        #Given an agent_name, continue the conversation, and format response into the log
        if (agent_name in self.team):
            agent = self.team[agent_name]
            
            #get the last response in the conversation log, and retrieve relevant vectors on that

            prev_response = self.chat_log[-1]["content"]
            agent_info = agent.get_self_knowledge(query=prev_response, query_kb = draw_from_knowledge, vectors = 3)
            
            #agent_info comprises agent info like retrieved vectors, expertise, .... Now we can run chatcomplete
            #agent_context create a prompt using agent_info. It also combines w the given prompt
            agent_context = f"""You are {agent_name}, {agent_info['role']}, 
            with expertise in {agent_info['expertise']}. 
            """

            if agent_info['relevant_knowledge'] != '':
                agent_context += """Consider the following background knowledge you already have on this topic:
                {agent_info['relevant_knowledge']}"""
            
            agent_context += prompt
            
            #inject relevant vectors into Chat log so that they can be reasoned over.
            #inject system prompt
            agent_prompt = {"role": "user", "content": agent_context}
            self.chat_log.append(agent_prompt)
            
            response = self.engine.chat_complete(chatlog = self.chat_log)
            response_text = response['output']
            #add response to log
            format_response = {"role": "assistant", "content": response_text}
            self.chat_log.append(format_response)
            tokens = response['tokens']
            self.input_token_total += tokens[0]
            self.output_token_total += tokens[1]

            return response_text
            #...decide if i want to return anything here
        else:
            print(f"ERROR: AGENT {agent_name} NOT IN AGENTS")

