import transformers
import numpy as np
import keras
from flask import Blueprint, jsonify
from http import HTTPStatus
from time import time

emotion_classifier = Blueprint("emotion_classifier", __name__)

MODEL_NAME = "bert-base-uncased"
MAX_LENGTH = 128
classes = {1: "fear", 2: "joy", 3: "love", 4: "sadness"}


@emotion_classifier.route("/emotion_classifier/<prompt>", methods=['GET'])
def fetch_emotion_from_text(prompt: str):
    """
    Get user context from chatbot conversation and fetch emotion tag from AI model

    Params:
        input: user prompt

    Returns:
        str: emotion tag
    """
    start = time()
    sentence_tokenizer = transformers.BertTokenizer.from_pretrained(MODEL_NAME)
    text_tokens = sentence_tokenizer(prompt, add_special_tokens=True, padding="max_length", truncation=True, max_length=MAX_LENGTH, return_tensors="tf")
    emotionClassifier = keras.models.load_model("/checkpoint/model.h5", custom_objects={"TFBertModel": transformers.TFBertModel})
    user_input = [np.array(text_tokens["input_ids"]), np.array(text_tokens["attention_mask"])]
    preds = emotionClassifier.predict(user_input)
    # print(preds)
    predicted_labels = np.argmax(preds.tolist(), axis=1)
    # print(predicted_labels)
    categorical_value = [classes[label] for label in predicted_labels]
    print(categorical_value)
    end = start
    print(f"{end - start} seconds")
    return jsonify(categorical_value), HTTPStatus.OK
