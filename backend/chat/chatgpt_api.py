import openai
import os
from dotenv import load_dotenv
from flask import jsonify, Blueprint
from http import HTTPStatus

chatgpt = Blueprint("chatgpt", __name__)
load_dotenv()


def initialise_API():
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("API key must be set in environment")
    openai.api_key = api_key
    return openai


@chatgpt.route("/fetch_gpt_bot_response", methods=["POST"])
def get_chatgpt_api_response(prompt: str):
    system = "You are a highly professional and empathetic AI assistant designed to provide personalised support in 1-to-1 conversations. Your role is to assist university students with their questions, offer guidance effectively, and solve problems. Maintain friendly, helpful, and understanding tone while respecting the user's privacy and boundaries. Tailor your responses the user's context, and avoid giving unhelpful or generic answers. If your unable to assist provide clear explanations and suggest alternative resources/solutions. Do not provide legal, medical, financial advice unless trained for those domains, and always disclaim appropriately in such cases."

    client = initialise_API()
    LLM_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": prompt}],
        temperature=1,
    )
    return jsonify({"result": LLM_response}), HTTPStatus.OK


def get_chatgpt_bot_response(prompt):
    system = "You are a highly professional and empathetic AI assistant designed to provide personalised support in 1-to-1 conversations. Your role is to assist university students with their questions, offer guidance effectively, and solve problems. Maintain friendly, helpful, and understanding tone while respecting the user's privacy and boundaries. Tailor your responses the user's context, and avoid giving unhelpful or generic answers. If your unable to assist provide clear explanations and suggest alternative resources/solutions. Do not provide legal, medical, financial advice unless trained for those domains, and always disclaim appropriately in such cases."
    user_prompt = f"Provide the completed version of the response. Keep it concise:\n\n{prompt}"

    client = initialise_API()
    LLM_response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[{"role": "developer", "content": system},
                  {"role": "user", "content": user_prompt}],
        temperature=0.5,
    )
    final_response = prompt + " " + LLM_response.choices[0].message.content
    return final_response
