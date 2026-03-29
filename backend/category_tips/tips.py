from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
import jwt
import os

tips = Blueprint("tips", __name__)

JWT_SECRET = os.environ.get('JWT_SECRET')


def _decode_token() -> dict:
    # Extract token from request header
    auth = request.authorization
    if not auth or not auth.token:
        raise ValueError("Missing authorization token")
    return jwt.decode(auth.token, key=JWT_SECRET, algorithms=["HS256"])


@tips.route("/store_tip/<category>", methods=["POST"])
def store_category_tip(category: str) -> tuple:
    try:
        _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    # Extract tip from front-end
    data = request.get_json()
    if not data or "user" not in data or "currentTip" not in data:
        return jsonify({"error": "Missing 'user' or 'currentTip' in request body"}), HTTPStatus.BAD_REQUEST

    # Add it to the user tip object
    document = {
        "user": data["user"],
        "category": category,
        "tip": data["currentTip"]
    }
    mongo_db.user_favourite_tips.insert_one(document)
    return jsonify({"result": f"Tip stored successfully for category: {category}"}), HTTPStatus.OK


@tips.route("/fetch_category_tips/<category>", methods=["GET"])
def fetch_category_tips(category: str) -> tuple:
    try:
        decoded = _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    user = decoded["user"]
    # Fetch tips for specific user and category
    results = mongo_db.user_favourite_tips.find({"user": user, "category": category}, {"_id": 0})
    category_tips = [tip["tip"] for tip in results]
    return jsonify({"result": category_tips}), HTTPStatus.OK


@tips.route("/fetch_favourite_tips", methods=["GET"])
def fetch_favourite_tips() -> tuple:
    try:
        decoded = _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    user = decoded["user"]
    # Fetch all favourite tips for the user and count them
    total_favourite_tips = len(list(mongo_db.user_favourite_tips.find({"user": user}, {"_id": 0})))
    return jsonify({"result": total_favourite_tips}), HTTPStatus.OK


@tips.route("/remove_favourite_tip/<category>", methods=["DELETE"])
def remove_category_tip(category: str) -> tuple:
    try:
        decoded = _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data or "categoryTip" not in data:
        return jsonify({"error": "Missing 'categoryTip' in request body"}), HTTPStatus.BAD_REQUEST

    user = decoded["user"]
    # Remove the matching tip for the user and category
    result = mongo_db.user_favourite_tips.delete_one({"user": user, "category": category, "tip": data["categoryTip"]})
    if result.deleted_count == 0:
        return jsonify({"error": "Tip not found"}), HTTPStatus.NOT_FOUND
    return jsonify({"result": f"Tip removed successfully for category: {category}"}), HTTPStatus.OK


@tips.route("/category_click_count", methods=["POST"])
def category_click_count() -> tuple:
    try:
        _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), HTTPStatus.BAD_REQUEST

    # Store the category click data
    mongo_db.categories_badge.insert_one(data)
    return jsonify({"result": "Tip category stored successfully"}), HTTPStatus.OK


@tips.route("/fetch_visited_categories", methods=["GET"])
def fetch_visited_categories() -> tuple:
    try:
        decoded = _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    user = decoded["user"]
    # Fetch badge objects for specific user
    categories = list(mongo_db.categories_badge.find({"user": user}, {"_id": 0, "user": 0}))
    return jsonify({"result": categories}), HTTPStatus.OK


@tips.route("/generate_tip_count", methods=["POST"])
def generate_tip_count() -> tuple:
    try:
        _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data or "user" not in data:
        return jsonify({"error": "Missing 'user' in request body"}), HTTPStatus.BAD_REQUEST

    # Create counter object if not in DB - increase counter by 1
    existing_count = mongo_db.generate_tip_count.find_one({"user": data["user"]}, {"_id": 0})
    if existing_count is not None:
        mongo_db.generate_tip_count.update_one({"user": data["user"]}, {"$inc": {"count": 1}})
    else:
        mongo_db.generate_tip_count.insert_one({"user": data["user"], "count": data.get("count", 1)})
    return jsonify({"result": "Tip count stored successfully"}), HTTPStatus.OK


@tips.route("/fetch_tip_count", methods=["GET"])
def fetch_tip_count() -> tuple:
    try:
        decoded = _decode_token()
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        return jsonify({"error": str(e)}), HTTPStatus.UNAUTHORIZED

    user = decoded["user"]
    # Fetch counter object for specific user
    tip_count = mongo_db.generate_tip_count.find_one({"user": user}, {"_id": 0, "user": 0})
    return jsonify({"result": tip_count}), HTTPStatus.OK
