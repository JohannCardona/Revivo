from flask import Blueprint, request, jsonify
from http import HTTPStatus
import os
import requests
from chat.model import chat_model

chat = Blueprint("chat", __name__)


@chat.route("/chat", methods=["POST"])
def chatbot_conversations():
    data = request.get_json()
    bot_response = chat_model(data["prompt"])
    return jsonify({"result": bot_response}), HTTPStatus.OK
