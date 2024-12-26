from flask import Flask
from flask_cors import CORS


def main():
    app = Flask(__name__)

    app.app_context().push()
    CORS(app, origins=r".*")

    app.config["DEBUG"] = True
    from db.db import config
    app.config["MONGO_URI"] = config["PROD"]["DB_URI"]
    app.secret_key = config["PROD"]["SECRET_KEY"]

    from account.account import accounts
    from art_generation.DALLE3_img import generation
    from musicRecommender.spotifyMusicRecommender import spotify_recommender
    from summariseHistoryName.historyName import conversation_title
    app.register_blueprint(accounts)
    app.register_blueprint(generation)
    app.register_blueprint(spotify_recommender)
    app.register_blueprint(conversation_title)

    return app
