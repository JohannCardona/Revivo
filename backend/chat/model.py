# import logs
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from time import time

def chat_model(prompt):
    start = time()
    # print("LOAD BASE MODEL")
    base_model_name = "unsloth/llama-3.2-3b-instruct-bnb-4bit"
    tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        load_in_4bit=True,
        device_map="auto",
    )

    # print("LOAD LORA-ADAPTED MODEL")
    adapter_name = "sujal011/llama3.2-3b-mental-health-chatbot"
    model = PeftModel.from_pretrained(
        base_model, adapter_name)
    context = f"User: {prompt}\nAssistant:"
    # print("TOKENIZER")
    input_ids = tokenizer(context, return_tensors="pt").input_ids.to("cuda")
    # print("GENERATE")
    output = model.generate(input_ids, max_length=150, temperature=0.7,
                            eos_token_id=tokenizer.eos_token_id, repetition_penalty=1.2)
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    # print("RAW RESPONSE: \n", response)
    # print("PROCESSED RESPONSE: ", response.split("Assistant: ")[-1].strip())
    end = time()
    print(f"Execution time: {end - start} sec")
    return response.split("Assistant: ")[-1].strip()
