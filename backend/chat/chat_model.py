from flask import Blueprint, request, jsonify
from http import HTTPStatus
from chat.mental_health_fine_tuned_model import chat_model
import time

chat = Blueprint("chat", __name__)


@chat.route("/chat", methods=["POST"])
def chatbot_conversations():
    start = time.time()
    data = request.get_json()
    bot_response = chat_model(data["prompt"])
    end = time.time()
    print(f"Execution lasted: {end- start} sec")
    return jsonify({"result": bot_response}), HTTPStatus.OK
