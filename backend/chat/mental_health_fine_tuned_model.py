# import logs
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained(
    r"C:\mental_health_chatbot_finetuned")
model = AutoModelForCausalLM.from_pretrained(
    r"C:\mental_health_chatbot_finetuned")

def chat_model(user_input):
    # Prepare context for user message
    context = f"User: {user_input}\nAssistant:"
    # Convert user query to tokens
    input_ids = tokenizer(context, return_tensors="pt").input_ids.to("cuda")
    # Generate answer
    output = model.generate(input_ids, max_length=100, temperature=0.7)
    # Convert back to text
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    # Remove Assistant part from response
    if "Assistant:" in response:
        response = response.split("Assistant:")[-1].strip()
    return response
