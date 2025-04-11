import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import get_peft_model, LoraConfig, TaskType

# Code for experiments on GPU server
df = pd.read_csv("preprocessed_dataset.csv")

df = df.dropna()
df['input_tokens'] = "User: " + df['Context'] + "\nAssistant:"
df['target_tokens'] = df['Response']

tokenizer = AutoTokenizer.from_pretrained(
    "sujal011/llama3.2-3b-mental-health-chatbot")

# Tokenise text
def preprocess_function(examples):
    inputs = tokenizer(examples["input_tokens"],
                       max_length=512, padding=True, truncation=True)
    outputs = tokenizer(examples["target_text"],
                        max_length=512, padding=True, truncation=True)
    inputs["labels"] = outputs["input_ids"]
    return inputs

df = Dataset.from_pandas(df)
tokenized_dataset = df.map(preprocess_function, batched=True)

train_test_split = tokenized_dataset.train_test_split(test_size=0.2)
train_dataset = train_test_split['train']
eval_dataset = train_test_split['test']

# Load pre-trained model
model = AutoModelForCausalLM.from_pretrained(
    "sujal011/llama3.2-3b-mental-health-chatbot",
    load_in_4bit=True,
    device_map="auto"
)

# LoRA parameters
peft_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    inference_mode=False,
    r=8,
    lora_alpha=16,
    lora_dropout=0.1
)

model = get_peft_model(model, peft_config)

# Defined arguments for fine-tuning
training_args = TrainingArguments(
    output_dir="./mental_health_chatbot_finetuned",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=3e-5,
    num_train_epochs=3,
    per_device_train_batch_size=42,
    per_device_eval_batch_size=42,
    logging_dir='./logs',
    logging_steps=10,
    save_total_limit=2,
    fp16=True,  # Use mixed precision for faster training
    push_to_hub=False,  # False as we don't want to upload to HuggingFace
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
)

trainer.train()

# Evaluate on fine-tune model
eval_results = trainer.evaluate()
print(eval_results)

# Save model metadata
model.save_pretrained("./mental_health_chatbot_finetuned")
tokenizer.save_pretrained("./mental_health_chatbot_finetuned")
