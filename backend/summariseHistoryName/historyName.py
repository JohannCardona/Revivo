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
def get_conversation_title(context) -> str:
    system = "You are an assistant that summarises text in 5 words."
    prompt = f"Give the context of this text in 6 words without using punctuation such as `(,!?.;)`:\n{context}"

    client = initialise_API()
    LLM_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": prompt}],
        max_tokens=15,
        temperature=0.8
    )
    return LLM_response.choices[0].message.content.strip()


if __name__ == "__main__":
    prompt = "I am very happy today because I was able to pass my final exam."
    title = get_conversation_title(context=prompt)
    print(title)
