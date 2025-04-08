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
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    response = ""
    if decoded_token:
        # Extract user prompt from front-end
        data = request.get_json()
        punct_marks = {".", "!", "?"}
        response = ""
        # Make a call to the LLM model
        bot_response = chat_model(data["prompt"])
        # If incomplete answer, callback to ChatGPT API
        if bot_response.strip()[-1] not in punct_marks:
            gpt_response = get_chatgpt_bot_response(prompt=data["prompt"])
            response = gpt_response
        else:
            response = bot_response
    return jsonify({"result": response}), HTTPStatus.OK
