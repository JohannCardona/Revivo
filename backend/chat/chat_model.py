from flask import Blueprint, request, jsonify
from http import HTTPStatus
import os
import requests
from model import chat_model

chat = Blueprint("chat", __name__)


@chat.route("/chat", methods=["POST"])
def chatbot_conversations():
    bot_response = chat_model()
    return jsonify({"result": bot_response}), HTTPStatus.OK
