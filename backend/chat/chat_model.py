from flask import Blueprint, request, jsonify
from http import HTTPStatus
from chat.mental_health_fine_tuned_model import chat_model
import time
from chat.chatgpt_api import get_chatgpt_bot_response

chat = Blueprint("chat", __name__)


@chat.route("/chat", methods=["POST"])
def chatbot_conversations():
    start = time.time()
    data = request.get_json()
    punct_marks = {".", "!", "?"}
    response = ""
    bot_response = chat_model(data["prompt"])
    if bot_response.strip()[-1] not in punct_marks:
        print("SENTENCE INCOMPLETE")
        gpt_response = get_chatgpt_bot_response(prompt=bot_response)
        response = gpt_response
    else:
        print("COMPLETE SENTENCE")
        response = bot_response
    end = time.time()
    print(f"Execution lasted: {end- start} sec")
    return jsonify({"result": response}), HTTPStatus.OK
