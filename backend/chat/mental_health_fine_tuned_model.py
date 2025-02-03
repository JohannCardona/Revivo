# import logs
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained(
    r"C:\mental_health_chatbot_finetuned")
model = AutoModelForCausalLM.from_pretrained(
    r"C:\mental_health_chatbot_finetuned")

def chat_model(user_input):
    context = f"User: {user_input}\nAssistant:"
    input_ids = tokenizer(context, return_tensors="pt").input_ids.to("cuda")
    output = model.generate(input_ids, max_length=100, temperature=0.7)
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    if "Assistant:" in response:
        response = response.split("Assistant:")[-1].strip()
    return response
