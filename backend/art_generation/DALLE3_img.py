import openai
from flask import Blueprint, request, jsonify
from http import HTTPStatus
from dotenv import load_dotenv
import os

load_dotenv()

generation = Blueprint("generation", __name__)

client = openai.OpenAI(
    organization=os.environ.get('organization'),
    project=os.environ.get('project'),
    api_key=os.environ.get('api_key')
)

@generation.route("/image_generation", methods=["POST"])
def get_user_prompt():
    data = request.get_json()
    response = client.images.generate(
        model="dall-e-3",
        prompt=data["prompt"],
        size="1024x1024",
        quality="standard",
        n=1,
        response_format="b64_json"
    )
    img_url = response.data[0].b64_json
    return jsonify({"result": img_url}, HTTPStatus.OK)
