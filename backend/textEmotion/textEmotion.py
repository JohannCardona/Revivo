import transformers
import numpy as np
import keras
from flask import Blueprint, jsonify, request
from http import HTTPStatus
import jwt
from transformers.optimization_tf import WarmUp

emotion_classifier = Blueprint("emotion_classifier", __name__)

MODEL_NAME = "huawei-noah/TinyBERT_General_4L_312D"
MAX_LENGTH = 128
classes = {0: "sadness", 1: "joy", 2: "love",
           3: "anger", 4: "fear", 5: "surprise"}


@emotion_classifier.route("/emotion_classifier/<prompt>", methods=['GET'])
def fetch_emotion_from_text(prompt: str):
    """
    Get user context from chatbot conversation and fetch emotion tag from AI model

    Params:
        input: user prompt

    Returns:
        str: emotion tag
    """
    jwt_token = request.authorization
    token = jwt_token.token
    categorical_value = ""
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    if decoded_token:
        sentence_tokenizer = transformers.AutoTokenizer.from_pretrained(MODEL_NAME)
        text_tokens = sentence_tokenizer(prompt, add_special_tokens=True, padding="max_length",
                                        truncation=True, max_length=MAX_LENGTH, return_tensors="tf")
        emotionClassifier = keras.models.load_model(r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\textEmotion\checkpoint\tiny_bert_connect_drop2.h5", custom_objects={
                                                    "TFBertModel": transformers.TFBertModel, "WarmUp": WarmUp})
        user_input = [np.array(text_tokens["input_ids"]),
                    np.array(text_tokens["attention_mask"])]
        preds = emotionClassifier.predict(user_input)
        predicted_labels = np.argmax(preds.tolist(), axis=1)
        categorical_value = [classes[label] for label in predicted_labels]
    return jsonify(categorical_value), HTTPStatus.OK
