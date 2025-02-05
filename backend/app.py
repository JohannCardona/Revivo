from flask_cors import CORS
from flask import Flask

def main():
    app = Flask(__name__)

    app.app_context().push()
    CORS(app, origins=r".*")

    app.config["DEBUG"] = True
    from db.db import config
    app.config["MONGO_URI"] = config["PROD"]["DB_URI"]
    app.secret_key = config["PROD"]["SECRET_KEY"]

    # from videos.storeVideoCollection import store_videos
    # store_videos()
    from account.account import accounts
    from art_generation.DALLE3_img import generation
    from musicRecommender.spotifyMusicRecommender import spotify_recommender
    from summariseHistoryName.historyName import conversation_title
    from chat.conversations import conversations
    from textEmotion.textEmotion import emotion_classifier
    from chat.chat_model import chat
    from videos.video_library import video_library
    from userMoods.userMoods import userMoods
    from category_tips.tips import tips
    app.register_blueprint(accounts)
    app.register_blueprint(generation)
    app.register_blueprint(spotify_recommender)
    app.register_blueprint(conversation_title)
    app.register_blueprint(conversations)
    app.register_blueprint(emotion_classifier)
    app.register_blueprint(chat)
    app.register_blueprint(video_library)
    app.register_blueprint(userMoods)
    app.register_blueprint(tips)

    return app
