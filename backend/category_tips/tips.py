from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
import jwt

tips = Blueprint("tips", __name__)

@tips.route("/store_tip/<category>", methods=["POST"])
def store_category_tip(category):
    data = request.get_json()
    print(data)

    document = {
        "user": data["user"],
        "category": category,
        "tip": data["currentTip"]
    }

    mongo_db.user_favourite_tips.insert_one(document)

    return jsonify({"result": f"Tip stored successfully for category: {category}"}), HTTPStatus.OK

@tips.route("/fetch_category_tips/<category>", methods=["GET"])
def fetch_category_tips(category):
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    tips = mongo_db.user_favourite_tips.find({"user": user, "category": category}, {"_id": 0})
    print("TIPS: ", tips)
    category_tips = []
    for tip in tips:
        category_tips.append(tip["tip"])
    print(category_tips)
    return jsonify({"result": category_tips}), HTTPStatus.OK

@tips.route("/remove_favourite_tip/<category>", methods=["DELETE"])
def remove_category_tip(category):
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]

    mongo_db.user_favourite_tips.delete_one({"user": user, "category": category, "tip": "tip"})

    return jsonify({"result": f"Tip removed successfully for category: {category}"}), HTTPStatus.OK