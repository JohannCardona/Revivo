from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
from dotenv import load_dotenv
import datetime

conversations = Blueprint("conversations", __name__)
load_dotenv()


@conversations.route("/conversations", methods=["POST"])
def account_registration():
    data = request.get_json()

    print("CONVERSATIONS: \n", data)

    user_conversations = mongo_db.user_conversations.insert_many(data)
    print(user_conversations)

    return jsonify({"result": "Conversation stored succesfully"}), HTTPStatus.OK


@conversations.route("/keyword_frequency", methods=["GET"])
def fetch_keyword_frequency():

    objects = mongo_db.user_conversations.find({"chatbot": False})
    keyword_frequency = []
    for i in objects:
        print(i)
        keyword_frequency.append({"response": i["response"]})

    return jsonify({"result": keyword_frequency}), HTTPStatus.OK
