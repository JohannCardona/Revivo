from flask import Blueprint, request, jsonify
from http import HTTPStatus
from chat.mental_health_fine_tuned_model import chat_model
import jwt
from chat.chatgpt_api import get_chatgpt_bot_response

chat = Blueprint("chat", __name__)


@chat.route("/chat", methods=["POST"])
def chatbot_conversations():
    # Extract token from request header
    jwt_token = request.authorization
    if not jwt_token or not jwt_token.token:
        return jsonify({"error": "Missing authorization token"}), HTTPStatus.UNAUTHORIZED
    try:
        decoded_token = jwt.decode(jwt_token.token, key="revivo", algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), HTTPStatus.UNAUTHORIZED

    # Extract user prompt from front-end
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Missing prompt"}), HTTPStatus.BAD_REQUEST

    punct_marks = {".", "!", "?"}
    # Make a call to the LLM model
    bot_response = chat_model(data["prompt"])
    # If incomplete answer, callback to ChatGPT API
    if not bot_response.strip() or bot_response.strip()[-1] not in punct_marks:
        response = get_chatgpt_bot_response(prompt=data["prompt"])
    else:
        response = bot_response
    return jsonify({"result": response}), HTTPStatus.OK
