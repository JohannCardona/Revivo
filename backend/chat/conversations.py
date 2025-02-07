from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
from dotenv import load_dotenv

conversations = Blueprint("conversations", __name__)
load_dotenv()


@conversations.route("/conversations", methods=["POST"])
def account_registration():
    data = request.get_json()
    mongo_db.user_conversations.insert_many(data)
    return jsonify({"result": "Conversation stored succesfully"}), HTTPStatus.OK


@conversations.route("/keyword_frequency", methods=["GET"])
def fetch_keyword_frequency():
    objects = mongo_db.user_conversations.find({"chatbot": False})
    keyword_frequency = []
    for i in objects:
        keyword_frequency.append({"response": i["response"]})
    return jsonify({"result": keyword_frequency}), HTTPStatus.OK
