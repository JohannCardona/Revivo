from flask import Blueprint, jsonify
from http import HTTPStatus
from db.db import mongo_db


video_library = Blueprint("video_library", __name__)

@video_library.route("/videos", methods=["GET"])
def fetch_video_library():
    videos = list(mongo_db.video_library.find({}, {"_id": 0}))
    print(videos)
    return jsonify(videos), HTTPStatus.OK

