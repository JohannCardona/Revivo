from flask import Blueprint, jsonify, request
from http import HTTPStatus
from db.db import mongo_db
import jwt
import os


video_library = Blueprint("video_library", __name__)

JWT_SECRET = os.environ.get('JWT_SECRET')

@video_library.route("/videos", methods=["GET"])
def fetch_video_library() -> tuple:
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

    # Convert object to a list
    videos = list(mongo_db.video_library.find({}, {"_id": 0}))
    return jsonify(videos), HTTPStatus.OK

