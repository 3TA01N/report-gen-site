from agent import Agent
from conversation import Conversation
from engine import openai_engine

def run_meeting():
    engine = openai_engine("gpt-4o")
    #phase 1: acquire all params/context
    task = "Generate a report on climate change."
    expectations = "Must mention effecs of cfcs."
    cycles = 1
    report_guidelines = "Must title: Climate warriors"
    draw_from_knowledge = False
    #phase 2: data preprocessing
    #....
    papers_to_text_full = "Climate change bad"
    #phase 3: choose team, decide guiding questions
    #assume: we have a team fully decided already at this point.
    setup_team = {
        "ProjectLead": Agent(role="you are a team lead", expertise="People skills"),
        "Analyst": Agent(role="you are a critical analyst", expertise="Analyzing"),
    }
    worker_team = {"biologist": Agent(role = "You are a biologist agent", expertise="cliamte biology", kb_path = "./biologist"), "climate scientist": Agent(role = "You are a climate scientist", expertise="cliamte change", kb_path = "./climate")}
    team = worker_team | setup_team

    for agent_name, agent in worker_team.items():
        agent.set_engine(engine)
        agent_goal = "Follow the lead"
        agent.set_goal(agent_goal)

    guiding_questions = "1. What is climate change 2. Why is it bad 3. How do we fix it"

    start_prompt = f"""
            This is the context for a team meeting to discuss the following task:
            {task}
            The discussion will base around the following guiding questions: 
            {guiding_questions}

            {papers_to_text_full}
            """
    conversation = Conversation(team, start_prompt = start_prompt, engine = engine)
    #jumpstart with lead

    lead_prompt = "Lead: start the conversation by assigning tasks. Further, if relevant memories are provided, draw from those as well."
    lead_response = conversation.convo_prompt(prompt=lead_prompt, agent_name = 'ProjectLead', draw_from_knowledge = False)
    for agent_key in team:
        print(conversation.convo_prompt(prompt = "Continue the conversation", agent_name = agent_key, draw_from_knowledge = True))
        #method:
        #Conversation class. init with a task/(anything else needed) in systemprompt as such#self.messages = [{"role": "system", "content": system_prompt}]
        #FOR ALL CONVO CALLS: the bae info(ie the main task, guiding qs, etc) are put into 
        #on new convo entry: 
        #agent.continue_convo(query, chat_log, query_kb, vectors, format, debug_log=False)
        #relevant info is either put into a dict in messages, or more important in instructions
        #this then calls engine.chat_complete
        #instead of prompting in between each convo, ie "respond to the convo", just add that to instructions("is that a thing?")
    #Here hae analyst
    print("FINAL LOGS")
    print(conversation.chat_log)
    #phase 4: conversation

run_meeting()