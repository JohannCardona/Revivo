from base64 import b64decode, b64encode
from PIL import Image
from io import BytesIO
import openai
from flask import Blueprint, request, jsonify
from http import HTTPStatus
from dotenv import load_dotenv
import os
import jwt

# This is to load the API key from the environment variables
load_dotenv()

generation = Blueprint("generation", __name__)

JWT_SECRET = os.environ.get('JWT_SECRET')

# Create DALL-E object
client = openai.OpenAI(
    organization=os.environ.get('organization'),
    project=os.environ.get('project'),
    api_key=os.environ.get('api_key')
)

@generation.route("/image_generation", methods=["POST"])
def get_user_prompt() -> tuple:
    auth = request.authorization
    if not auth or not auth.token:
        return jsonify({"error": "Missing authorization token"}), HTTPStatus.UNAUTHORIZED

    try:
        jwt.decode(auth.token, key=JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), HTTPStatus.UNAUTHORIZED
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), HTTPStatus.UNAUTHORIZED

    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Missing 'prompt' in request body"}), HTTPStatus.BAD_REQUEST

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=data["prompt"],
            size="1024x1024",
            quality="standard",
            n=1,
            response_format="b64_json"
        )
    except openai.OpenAIError as e:
        return jsonify({"error": f"Image generation failed: {str(e)}"}), HTTPStatus.INTERNAL_SERVER_ERROR

    img_b64 = response.data[0].b64_json
    url = compress_image(img_b64)
    return jsonify({"result": url}), HTTPStatus.OK


def compress_image(b64_json: str, format: str = "JPEG", encoding: str = "utf-8", quality: int = 50) -> str:
    data = b64decode(b64_json)
    with BytesIO(data) as image_buff:
        image = Image.open(image_buff)
        with BytesIO() as compressed_buff:
            image.save(compressed_buff, format=format, quality=quality, optimize=True)
            return b64encode(compressed_buff.getvalue()).decode(encoding=encoding)
