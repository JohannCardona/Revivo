from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
import jwt
from dotenv import load_dotenv

conversations = Blueprint("conversations", __name__)
load_dotenv()


@conversations.route("/conversations", methods=["POST"])
def account_registration():
    data = request.get_json()
    mongo_db.user_conversations.insert_one(data)
    return jsonify({"result": "Conversation stored succesfully"}), HTTPStatus.OK


@conversations.route("/fetching_conversations", methods=["GET"])
def fetching_conversations():
    chats = mongo_db.user_conversations.find()
    user_chats = []
    for i in chats:
        user_chats.append({"id": i["id"], "chatbot": i["chatbot"],
                          "response": i["response"]})
    return jsonify({"result": user_chats}), HTTPStatus.OK


@conversations.route("/fetching_user_conversations/<chat_title>", methods=["GET"])
def fetching_user_conversations(chat_title):
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    print(user)
    chats = mongo_db.user_conversations.find_one(
        {"user": user, "conversationTitle": chat_title}, {"_id": 0})
    print(chats)
    return jsonify({"result": chats}), HTTPStatus.OK


@conversations.route("/keyword_frequency", methods=["GET"])
def fetch_keyword_frequency():
    objects = mongo_db.user_conversations.find({"chatbot": False})
    keyword_frequency = []
    for i in objects:
        keyword_frequency.append({"response": i["response"]})
    return jsonify({"result": keyword_frequency}), HTTPStatus.OK
