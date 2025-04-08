from flask import Blueprint, jsonify, request
from http import HTTPStatus
from db.db import mongo_db
import jwt


video_library = Blueprint("video_library", __name__)

@video_library.route("/videos", methods=["GET"])
def fetch_video_library():
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    videos = list()
    if decoded_token:
        # Convert object to a list
        videos = list(mongo_db.video_library.find({}, {"_id": 0}))
    return jsonify(videos), HTTPStatus.OK

