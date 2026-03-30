import os
from transformers import AutoTokenizer, AutoModelForCausalLM

# Code for experiments on GPU server
_MODEL_PATH = os.environ.get(
    "FINETUNED_MODEL_PATH",
    os.path.join(os.path.dirname(__file__), "mental_health_chatbot_finetuned"),
)
tokenizer = AutoTokenizer.from_pretrained(_MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(_MODEL_PATH)

def chat_model(user_input: str) -> str:
    # Prepare context for user message
    context = f"User: {user_input}\nAssistant:"
    # Convert user query to tokens
    input_ids = tokenizer(context, return_tensors="pt").input_ids.to("cuda")
    # Generate answer
    output = model.generate(input_ids=input_ids, max_length=100, do_sample=True, temperature=0.7)
    # Convert back to text
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    # Remove Assistant part from response
    if "Assistant:" in response:
        response = response.split("Assistant:")[-1].strip()
    return response
