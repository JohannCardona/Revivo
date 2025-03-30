from flask import Blueprint, request, jsonify
from http import HTTPStatus
from chat.mental_health_fine_tuned_model import chat_model
import time
from chat.chatgpt_api import get_chatgpt_bot_response

chat = Blueprint("chat", __name__)


@chat.route("/chat", methods=["POST"])
def chatbot_conversations():
    data = request.get_json()
    punct_marks = {".", "!", "?"}
    response = ""
    bot_response = chat_model(data["prompt"])
    if bot_response.strip()[-1] not in punct_marks:
        gpt_response = get_chatgpt_bot_response(prompt=data["prompt"])
        response = gpt_response
    else:
        response = bot_response
    return jsonify({"result": response}), HTTPStatus.OK
