from transformers import AutoModel
from huggingface_hub import login
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.DEBUG)

load_dotenv()

login(token=os.environ.get('TOKEN'))

print("MODEL...")
try:
    model = AutoModel.from_pretrained(
    "GRMenon/mental-health-mistral-7b-instructv0.2-finetuned-V2")
    print(model)
except Exception as e:
    print("Exception: ", e)