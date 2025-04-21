# REPORT GEN SITE

## Motivation
Though there are many custom chatbots/tools based around LLMs, and many more that use RAG(retrieval augmented generation), what sets my tool apart is the integration of RAG with AI Agent conversations. 
This project was based on VirtualLab's (https://github.com/zou-group/virtual-lab) methodology of having conversations facilitated by a lead agent, with the lead agent choosing the agents it wants to use for the task along with a critic to keep the conversation in check. 
The difference virtual lab's agents, lead, and critic are mostly prompt based: ie, a way of structuring a prompt in a way that simulate a conversation.
I instead created classes for the leads and agents that allow them to have a physical FAISS knowledge base they can draw information from when generating an output.

## Usage 
This is a web app with a Django backend(hosted on render) and a React frontend(hosted on vercel). I haven't bought a domain name yet(planning to do so after optimizing my app to be less RAM intensive as right now it still crashes every once in a while). For now, if you want to test it out you will have to do so locally: setting a .env.local file in the backend, where you need to set the vars
DEBUG=True
DJANGO_SECRET_KEY=(your django key)
DJANGO_ALLOWED_HOSTS=localhost
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:8000
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
DJANGO_ENV=local

OPENAI_API_KEY=(your api key)
USE_S3=False

then run docker-compose up --build

The frontend will be hosted at http://localhost:5173.

## Technologies used
React
Django
PostgreSQL
Amazon S3
Docker 
Nginx

FAISS(Knowledge bases)
OpenAI(API Calls)
HuggingFace Embedders