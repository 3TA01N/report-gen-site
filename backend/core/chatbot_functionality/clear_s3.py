#script that periodically deletes a user's files on s3
from .KnowledgeBase import s3Interface

def clear_s3(clear_folder):
    return