from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
import jwt

tips = Blueprint("tips", __name__)

@tips.route("/store_tip/<category>", methods=["POST"])
def store_category_tip(category):
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    if decoded_token:
        # Extract tip from front-end
        data = request.get_json()
        # Add it to the user tip object
        document = {
            "user": data["user"],
            "category": category,
            "tip": data["currentTip"]
        }
        mongo_db.user_favourite_tips.insert_one(document)
    return jsonify({"result": f"Tip stored successfully for category: {category}"}), HTTPStatus.OK

@tips.route("/fetch_category_tips/<category>", methods=["GET"])
def fetch_category_tips(category):
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    tips = mongo_db.user_favourite_tips.find({"user": user, "category": category}, {"_id": 0})
    category_tips = []
    for tip in tips:
        category_tips.append(tip["tip"])
    return jsonify({"result": category_tips}), HTTPStatus.OK


@tips.route("/fetch_favourite_tips", methods=["GET"])
def fetch_favourite_tips():
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    tips = list(mongo_db.user_favourite_tips.find(
        {"user": user}, {"_id": 0}))
    total_favourite_tips = len(tips)
    return jsonify({"result": total_favourite_tips}), HTTPStatus.OK

@tips.route("/remove_favourite_tip/<category>", methods=["DELETE"])
def remove_category_tip(category):
    data = request.get_json()
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    mongo_db.user_favourite_tips.delete_one({"user": user, "category": category, "tip": data["categoryTip"]})
    return jsonify({"result": f"Tip removed successfully for category: {category}"}), HTTPStatus.OK

@tips.route("/category_click_count", methods=["POST"])
def category_click_count():
    data = request.get_json()
    mongo_db.categories_badge.insert_one(data)
    return jsonify({"result": "Tip category stored successfully!!!"}), HTTPStatus.OK


@tips.route("/fetch_visited_categories", methods=["GET"])
def fetch_visited_categories():
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    # Fetch badges object for specific user
    # Add them to a list
    category_names = mongo_db.categories_badge.find({"user": user}, {"_id": 0, "user": 0})
    categories = []
    for name in category_names:
        categories.append(name)
    return jsonify({"result": categories}), HTTPStatus.OK


@tips.route("/generate_tip_count", methods=["POST"])
def generate_tip_count():
    # Get value from front-end
    data = request.get_json()
    # Create counter object if not in DB - increase counter by 1
    existing_count = mongo_db.generate_tip_count.find_one({"user": data["user"]}, {"_id": 0})
    if existing_count is not None:
        mongo_db.generate_tip_count.update_one(
            {"user": data["user"]}, {"$inc": {"count": 1}})
    else:
        mongo_db.generate_tip_count.insert_one(
            {"user": data["user"], "count": data["count"]})
    return jsonify({"result": "Tip count stored successfully!!!"}), HTTPStatus.OK

@tips.route("/fetch_tip_count", methods=["GET"])
def fetch_tip_count():
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]
    # Fetch counter objects for specific user
    tip_count = mongo_db.generate_tip_count.find_one({"user": user}, {"_id": 0, "user": 0})
    return jsonify({"result": tip_count}), HTTPStatus.OK