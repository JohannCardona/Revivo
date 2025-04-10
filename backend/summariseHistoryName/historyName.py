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


def initialise_API():
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("API key must be set in environment")
    openai.api_key = api_key
    return openai


@conversation_title.route("/fetch_conversation_title/", methods=["POST"])
def get_conversation_title() -> str:
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]

    data = request.get_json()
    system = "You are an assistant that summarises text in 6 words."
    prompt = f"Give the context of this text in 6 words without using punctuation such as `(,!?.;)`:\n{data['prompt']}"

    client = initialise_API()
    LLM_response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": prompt}],
        max_tokens=15,
        temperature=0.8
    )
    title = LLM_response.choices[0].message.content.strip()
    document = {"user": user, "title": title}
    mongo_db.conversation_title.insert_one(document).inserted_id
    return jsonify({"result": title}), HTTPStatus.OK


@conversation_title.route("/fetch_conversation_titles/", methods=["GET"])
def fetch_conversation_titles():
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]

    titles = mongo_db.conversation_title.find({"user": user}, {"_id": 0})
    chat_titles = []
    for title in titles:
        chat_titles.append(title)
    return jsonify({"titles": chat_titles}), HTTPStatus.OK
