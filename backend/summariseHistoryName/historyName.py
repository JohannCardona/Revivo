import openai
from flask import Blueprint, jsonify
from http import HTTPStatus
import os
from dotenv import load_dotenv

load_dotenv()
conversation_title = Blueprint("conversation_title", __name__)


def initialise_API():
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("API key must be set in environment")
    openai.api_key = api_key
    return openai


@conversation_title.route("/fetch_conversation_title/<context>", methods=['GET'])
def get_conversation_title(context: str) -> str:
    system = "You are an assistant that summarises text in 6 words."
    prompt = f"Give the context of this text in 6 words without using punctuation such as `(,!?.;)`:\n{context}"

    client = initialise_API()
    LLM_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": prompt}],
        max_tokens=15,
        temperature=0.8
    )
    return jsonify({"result": LLM_response.choices[0].message.content.strip()}), HTTPStatus.OK
