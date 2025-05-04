
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv('../.env.local')


class openai_engine:
    def __init__(self, model):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.model = model
    def to_string(self):
        print("openai", self.model)
    #chat completion: takes in the chatlog and answeres the query given format
    def chat_complete(self, chatlog):
        
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=chatlog,
        )
        #print(completion)
        input_tokens = completion.usage.completion_tokens
        output_tokens = completion.usage.prompt_tokens
        
        return {"output": completion.choices[0].message.content, "tokens": [input_tokens, output_tokens]}




    def generate(self, query, format):
        if format == {}:
            response = self.client.responses.create(
                model=self.model,
                input=query
            )
        else:
            response = self.client.responses.create(
                model=self.model,
                input=query,
                text = format
            )
        print("FULL RESPONSE TEXT:", response.output_text)
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
        return (response.output_text, [input_tokens, output_tokens])