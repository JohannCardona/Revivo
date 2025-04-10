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

# Create DALL-E object
client = openai.OpenAI(
    organization=os.environ.get('organization'),
    project=os.environ.get('project'),
    api_key=os.environ.get('api_key')
)

@generation.route("/image_generation", methods=["POST"])
def get_user_prompt():
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    url = ""
    if decoded_token:
        # Get user prompt from front-end
        data = request.get_json()
        response = client.images.generate(
            model="dall-e-3",
            prompt=data["prompt"],
            size="1024x1024",
            quality="standard",
            n=1,
            response_format="b64_json"
        )
        # Return BSON URL for the generated image
        img_url = response.data[0].b64_json
        url = compress_image_url(img_url)
    return jsonify({"result": url}, HTTPStatus.OK)


def compress_image_url(b64_json, format="JPEG", encoding="utf-8", quality=50):
    data = b64decode(b64_json)
    with BytesIO(data) as image_buff:
        image = Image.open(image_buff)
        compressed_buff = BytesIO()
        # Compress image using specified quality and format
        image.save(compressed_buff, format=format,
                   quality=quality, optimize=True)
        # Convert the image data back to BSON URL
        compressed_b64 = b64encode(
            compressed_buff.getvalue()).decode(encoding=encoding)
    return compressed_b64
