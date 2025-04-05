from flask import Blueprint, jsonify, request
from http import HTTPStatus
import base64
import requests
import os
from dotenv import load_dotenv
from random import randint
import jwt

load_dotenv()
spotify_recommender = Blueprint("spotify_recommender", __name__)

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
TOKEN_URL = 'https://accounts.spotify.com/api/token'
SEARCH_URL = 'https://api.spotify.com/v1/search'

def spotify_login_token():
    auth = f"{CLIENT_ID}:{CLIENT_SECRET}"
    auth_header = base64.b64encode(auth.encode()).decode()
    res = requests.post(
        TOKEN_URL,
        headers={
            'Authorization': f'Basic {auth_header}'
        },
        data={
            'grant_type': 'client_credentials'
        }
    )

    if res.status_code == 200:
        return res.json().get("access_token"), res.status_code
    else:
        return None


@spotify_recommender.route("/music_recommendations/<genre>", methods=['GET'])
def music_recommendations(genre):
    jwt_token = request.authorization
    print("JWT TOKEN: ", jwt_token)
    token = jwt_token.token
    print("TOKEN: ", token)
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    recommended_songs = []
    if decoded_token:
        spot_token = spotify_login_token()
        if not spot_token:
            return jsonify({"result": "Failed to authenticate with Spotify"}), HTTPStatus.INTERNAL_SERVER_ERROR

        headers = {"Authorization": f"Bearer {spot_token[0]}"}
        offset = randint(0, 500)
        params = {"q": f"genre:{genre}", "type": "track", "limit": 5, "offset": offset}
        res = requests.get(SEARCH_URL, headers=headers, params=params)

        if res.status_code != 200:
            return jsonify({"result": "Failed to authenticate with Spotify"}), res.status_code
        music_info = res.json()
        for song in music_info["tracks"]["items"]:
            songs_info = {"name": song["name"], "artist": ", ".join(
                [artist["name"] for artist in song["artists"]]), "album": song["album"]["name"], "albumDate": song["album"]["release_date"], "spotifyURL": song["external_urls"]["spotify"], "songId": song["id"]}
            recommended_songs.append(songs_info)
    return jsonify(recommended_songs), HTTPStatus.OK
