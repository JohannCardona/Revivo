import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer
from transformers import AutoModelForCausalLM, TrainingArguments, Trainer
from peft import get_peft_model, LoraConfig, TaskType

df = pd.read_csv("preprocessed_dataset.csv")

df = df.dropna()
print(df)
df['input_tokens'] = "User: " + df['Context'] + "\nAssistant:"
df['target_tokens'] = df['Response']

dataset = Dataset.from_pandas(df)

tokenizer = AutoTokenizer.from_pretrained(
    "sujal011/llama3.2-3b-mental-health-chatbot")


def preprocess_function(examples):
    inputs = tokenizer(examples["input_tokens"],
                       max_length=512, padding=True, truncation=True)
    outputs = tokenizer(examples["target_text"],
                        max_length=512, padding=True, truncation=True)
    inputs["labels"] = outputs["input_ids"]
    return inputs


tokenized_dataset = dataset.map(preprocess_function, batched=True)

train_test_split = tokenized_dataset.train_test_split(test_size=0.2)
train_dataset = train_test_split['train']
eval_dataset = train_test_split['test']

model = AutoModelForCausalLM.from_pretrained(
    "sujal011/llama3.2-3b-mental-health-chatbot",
    load_in_4bit=True,
    device_map="auto"
)

peft_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    inference_mode=False,
    r=16,
    lora_alpha=32,
    lora_dropout=0.1
)

model = get_peft_model(model, peft_config)

training_args = TrainingArguments(
    output_dir="./mental_health_chatbot_finetuned",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=5e-5,
    num_train_epochs=3,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    logging_dir='./logs',
    logging_steps=10,
    save_total_limit=2,
    fp16=True,
    push_to_hub=False,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
)

trainer.train()

model.save_pretrained("./mental_health_chatbot_finetuned")
tokenizer.save_pretrained("./mental_health_chatbot_finetuned")
