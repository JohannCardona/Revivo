from flask import Blueprint, request, jsonify, typing
from typing import Union
from http import HTTPStatus
from db.db import mongo_db
from nltk.corpus import stopwords
import jwt
import re
from collections import Counter

conversations = Blueprint("conversations", __name__)
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


def _decode_token() -> Union[tuple[dict, None], tuple[None, tuple]]:
    """Extract and decode JWT from request authorization header."""
    jwt_token = request.authorization
    if not jwt_token or not jwt_token.token:
        return None, (jsonify({"error": "Missing authorization token"}), HTTPStatus.UNAUTHORIZED)
    try:
        decoded = jwt.decode(jwt_token.token, key="revivo", algorithms=["HS256"])
        return decoded, None
    except jwt.InvalidTokenError:
        return None, (jsonify({"error": "Invalid token"}), HTTPStatus.UNAUTHORIZED)


@conversations.route("/conversations", methods=["POST"])
def store_user_conversation() -> tuple:
    # Extract token from request header
    decoded_token, err = _decode_token()
    if err:
        return err
    # Extract conversation messages from front-end
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), HTTPStatus.BAD_REQUEST
    mongo_db.user_conversations.insert_one(data)
    return jsonify({"result": "Conversation stored succesfully"}), HTTPStatus.OK


@conversations.route("/fetching_user_conversations/<chat_title>", methods=["GET"])
def fetching_user_conversations(chat_title: str) -> tuple:
    # Extract token from request header
    decoded_token, err = _decode_token()
    if err:
        return err
    user = decoded_token["user"]
    # Fetch conversation messages for specific chat
    chats = mongo_db.user_conversations.find_one(
        {"user": user, "conversationTitle": chat_title}, {"_id": 0})
    if chats is None:
        return jsonify({"result": "Conversation not found"}), HTTPStatus.NOT_FOUND
    return jsonify({"result": chats}), HTTPStatus.OK


@conversations.route("/keyword_frequency", methods=["GET"])
def fetch_keyword_frequency() -> tuple:
    # Extract token from request header
    decoded_token, err = _decode_token()
    if err:
        return err
    user = decoded_token["user"]
    # Fetch user conversations
    objects = mongo_db.user_conversations.find({"user": user})
    keyword_frequency = []
    for i in objects:
        if "conversations" not in i:
            continue  # Skip documents missing the conversations field
        # Filter the messages that are not from the user
        for j in i["conversations"]:
            if not j["chatbot"]:
                keyword_frequency.append({"response": j["response"]})
    # Join all user messages
    get_text = " ".join(keyword["response"] for keyword in keyword_frequency)
    process_text = re.sub(r"[^\w\s]", "", get_text.lower())
    process_numbers = re.sub(r"\b\d+\b", "", process_text)
    # Remove unnecessary words from the messages
    remove_stopwords = [
        keyword for keyword in process_numbers.split() if keyword not in stopwords]
    # Retrieve top 5 words from the messages
    counter = Counter(remove_stopwords)
    frequent_words = counter.most_common(5)
    # Store counter alonside word in a list
    most_frequent_words = [{"keyword": keyword, "frequency": frequency}
                           for keyword, frequency in frequent_words]
    return jsonify({"result": most_frequent_words}), HTTPStatus.OK


@conversations.route("/post_song_genre_selection", methods=["POST"])
def post_song_genre_selection() -> tuple:
    # Extract token from request header
    decoded_token, err = _decode_token()
    if err:
        return err
    user = decoded_token["user"]
    # Extract song counter from front-end
    data = request.get_json()
    if not data or "song_genre" not in data:
        return jsonify({"error": "Missing song_genre"}), HTTPStatus.BAD_REQUEST

    # Store song counter to DB
    mongo_db.song_genres_count.update_one(
        {"user": user, "songGenre": data["song_genre"]}, {
            "$inc": {"count": 1}},
        upsert=True)

    return jsonify({"result": "Song genre count stored successfully!!!"}), HTTPStatus.OK


@conversations.route("/get_song_genre_count", methods=["GET"])
def get_song_genre_count() -> tuple:
    # Extract token from request header
    decoded_token, err = _decode_token()
    if err:
        return err
    user = decoded_token["user"]

    # Fetch song counter for specific user
    genre_count = mongo_db.song_genres_count.find({"user": user}, {"_id": 0})
    genre_count = list(genre_count.sort("count", -1).limit(5))
    return jsonify({"result": genre_count}), HTTPStatus.OK
