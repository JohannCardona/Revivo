from base64 import b64decode, b64encode
from PIL import Image
from io import BytesIO
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
    url = compress_image_url(img_url)
    return jsonify({"result": url}, HTTPStatus.OK)


def compress_image_url(b64_json, format="JPEG", encoding="utf-8", quality=50):
    data = b64decode(b64_json)
    with BytesIO(data) as image_buff:
        image = Image.open(image_buff)
        compressed_buff = BytesIO()
        image.save(compressed_buff, format=format,
                   quality=quality, optimize=True)
        compressed_b64 = b64encode(
            compressed_buff.getvalue()).decode(encoding=encoding)
    return compressed_b64
