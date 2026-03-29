from flask import Blueprint, jsonify, request
from http import HTTPStatus
from db.db import mongo_db
import jwt
import os

userMoods = Blueprint("userMoods", __name__)

JWT_SECRET = os.environ.get('JWT_SECRET')


@userMoods.route("/store_user_moods", methods=["POST"])
def store_user_moods() -> tuple:
    # Extract token from request header
    auth = request.authorization
    if not auth or not auth.token:
        return jsonify({"error": "Missing authorization token"}), HTTPStatus.UNAUTHORIZED

    try:
        jwt.decode(auth.token, key=JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), HTTPStatus.UNAUTHORIZED
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), HTTPStatus.UNAUTHORIZED

    # Create mood object containing metadata from front-end
    data = request.get_json()
    if not data or not all(k in data for k in ("user", "mood", "userNote", "timestamp")):
        return jsonify({"error": "Missing required fields in request body"}), HTTPStatus.BAD_REQUEST

    document = {
        "user": data["user"],
        "mood": data["mood"],
        "userNote": data["userNote"],
        "timestamp": data["timestamp"]
    }
    mongo_db.user_mood_tracker.insert_one(document)
    return jsonify({"result": "User mood stored successfully"}), HTTPStatus.OK


@userMoods.route("/fetch_user_moods", methods=["GET"])
def fetch_user_moods() -> tuple:
    # Extract token from request header
    auth = request.authorization
    if not auth or not auth.token:
        return jsonify({"error": "Missing authorization token"}), HTTPStatus.UNAUTHORIZED

    try:
        decoded_token = jwt.decode(auth.token, key=JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), HTTPStatus.UNAUTHORIZED
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), HTTPStatus.UNAUTHORIZED

    # Check existing user
    user = decoded_token["user"]
    # Store objects for specific user in a list
    moods = list(mongo_db.user_mood_tracker.find({"user": user}, {"_id": 0}))
    return jsonify({"result": moods}), HTTPStatus.OK
