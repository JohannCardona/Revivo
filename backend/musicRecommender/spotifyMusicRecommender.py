from flask import Blueprint, jsonify
from http import HTTPStatus
import base64
import requests
import os
from dotenv import load_dotenv

load_dotenv()
spotify_recommender = Blueprint("spotify_recommender", __name__)

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
TOKEN_URL = 'https://accounts.spotify.com/api/token'
SEARCH_URL = 'https://api.spotify.com/v1/search'

@spotify_recommender.route("/spotify_login", methods=['POST'])
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
    token = spotify_login_token()
    if not token:
        return jsonify({"error": "Failed to authenticate with Spotify"}), HTTPStatus.INTERNAL_SERVER_ERROR

    headers = {"Authorization": f"Bearer {token[0]}"}
    params = {"q": f"genre:{genre}", "type": "track", "limit": 5, "offset": 5}
    res = requests.get(SEARCH_URL, headers=headers, params=params)

    if res.status_code != 200:
        return jsonify({"error": "Failed to authenticate with Spotify"}), res.status_code
    music_info = res.json()
    recommended_songs = []
    for song in music_info["tracks"]["items"]:
        songs_info = {"name": song["name"], "artist": ", ".join(
            [artist["name"] for artist in song["artists"]]), "album": song["album"]["name"], "albumDate": song["album"]["release_date"], "spotifyURL": song["external_urls"]["spotify"], "songId": song["id"]}
        recommended_songs.append(songs_info)
    print(recommended_songs)
    return jsonify(recommended_songs), HTTPStatus.OK
