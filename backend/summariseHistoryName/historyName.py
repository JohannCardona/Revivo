import openai
from flask import Blueprint, jsonify, request
from http import HTTPStatus
import os
from db.db import mongo_db
import jwt
from dotenv import load_dotenv

# This is to load the secrets from the environment variables
load_dotenv()
conversation_title = Blueprint("conversation_title", __name__)

JWT_SECRET = os.environ.get('JWT_SECRET')


def initialise_API() -> openai.OpenAI:
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("API key must be set in environment")
    return openai.OpenAI(api_key=api_key)


@conversation_title.route("/fetch_conversation_title/", methods=["POST"])
def get_conversation_title() -> tuple:
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

    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Missing 'prompt' in request body"}), HTTPStatus.BAD_REQUEST

    user = decoded_token["user"]
    system = "You are an assistant that summarises text in 6 words."
    prompt = f"Give the context of this text in 6 words without using punctuation such as `(,!?.;)`:\n{data['prompt']}"

    try:
        client = initialise_API()
        LLM_response = client.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[{"role": "system", "content": system},
                      {"role": "user", "content": prompt}],
            max_tokens=15,
            temperature=0.8
        )
    except openai.OpenAIError as e:
        return jsonify({"error": f"Title generation failed: {str(e)}"}), HTTPStatus.INTERNAL_SERVER_ERROR

    title = LLM_response.choices[0].message.content.strip()
    document = {"user": user, "title": title}
    mongo_db.conversation_title.insert_one(document)
    return jsonify({"result": title}), HTTPStatus.OK


@conversation_title.route("/fetch_conversation_titles/", methods=["GET"])
def fetch_conversation_titles() -> tuple:
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

    user = decoded_token["user"]
    chat_titles = list(mongo_db.conversation_title.find({"user": user}, {"_id": 0}))
    return jsonify({"titles": chat_titles}), HTTPStatus.OK
