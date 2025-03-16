from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
from nltk.corpus import stopwords
import jwt
import re
from collections import Counter
from dotenv import load_dotenv

conversations = Blueprint("conversations", __name__)
load_dotenv()
stopwords = set(stopwords.words("english"))
more_stopwords = {
    "yes", "no", "okay", "hi", "hello", "bye", "thanks", "thank", "please",
    "really", "very", "just", "so", "well", "like",
    "i", "you", "he", "she", "we", "they", "it",
    "me", "my", "mine", "your", "yours", "his", "her", "their", "theirs",
    "with", "from", "to", "for", "on", "in", "by", "about", "at",
    "and", "or", "but", "if", "because", "so", "then",
    "who", "what", "where", "when", "why", "how", "exit", "is", "are"
}
stopwords.update(more_stopwords)


@conversations.route("/conversations", methods=["POST"])
def account_registration():
    data = request.get_json()
    mongo_db.user_conversations.insert_one(data)
    return jsonify({"result": "Conversation stored succesfully"}), HTTPStatus.OK


@conversations.route("/fetching_user_conversations/<chat_title>", methods=["GET"])
def fetching_user_conversations(chat_title):
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    chats = mongo_db.user_conversations.find_one(
        {"user": user, "conversationTitle": chat_title}, {"_id": 0})
    return jsonify({"result": chats}), HTTPStatus.OK


@conversations.route("/keyword_frequency", methods=["GET"])
def fetch_keyword_frequency():
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    objects = mongo_db.user_conversations.find(
        {"user": user})
    keyword_frequency = []
    for i in objects:
        if "conversations" not in i:
            return jsonify({"result": "No conversations found"}), HTTPStatus.NO_CONTENT
        for j in i["conversations"]:
            if j["chatbot"] == False:
                keyword_frequency.append({"response": j["response"]})
    get_text = " ".join(keyword["response"] for keyword in keyword_frequency)
    process_text = re.sub(r"[^\w\s]", "", get_text.lower())
    process_numbers = re.sub(r"\b\d+\b", "", process_text)
    remove_stopwords = [
        keyword for keyword in process_numbers.split() if keyword not in stopwords]
    counter = Counter(remove_stopwords)
    frequent_words = counter.most_common(5)
    most_frequent_words = [{"keyword": keyword, "frequency": frequency}
                           for keyword, frequency in frequent_words]
    return jsonify({"result": most_frequent_words}), HTTPStatus.OK


@conversations.route("/post_song_genre_selection", methods=["POST"])
def post_song_genre_selection():
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    data = request.get_json()
    print(data)

    mongo_db.song_genres_count.update_one(
        {"user": user, "songGenre": data["song_genre"]}, {
            "$inc": {"count": 1}},
        upsert=True)

    return jsonify({"result": "Song genre count stored successfully!!!"}), HTTPStatus.OK

@conversations.route("/get_song_genre_count", methods=["GET"])
def get_song_genre_count():
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]

    genre_count = mongo_db.song_genres_count.find({"user": user}, {"_id": 0})
    genre_count = list(genre_count.sort("count", -1).limit(5))
    print(genre_count)
    return jsonify({"result": genre_count}), HTTPStatus.OK