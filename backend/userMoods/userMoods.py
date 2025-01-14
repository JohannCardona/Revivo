from flask import Blueprint, jsonify, request
from http import HTTPStatus
from db.db import mongo_db
import jwt

userMoods = Blueprint("userMoods", __name__)


@userMoods.route("/store_user_moods", methods=["POST"])
def store_user_moods():
    data = request.get_json()
    document = {
        "user": data["user"],
        "mood": data["mood"],
        "userNote": data["userNote"],
        "timestamp": data["timestamp"]
    }
    mongo_db.user_mood_tracker.insert_one(document)
    return jsonify({"result": "User mood stored successfully!!!"}), HTTPStatus.OK


@userMoods.route("/fetch_user_moods", methods=["GET"])
def fetch_user_moods():
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    
    user_moods = mongo_db.user_mood_tracker.find({"user": user}, {"_id": 0})
    moods = []
    for i in user_moods:
        moods.append(i)

    return jsonify({"result": moods}), HTTPStatus.OK
