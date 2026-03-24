from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
import jwt
import datetime
import re
from better_profanity import profanity

# 1. Load the default blacklist
profanity.load_censor_words()
profanity.add_censor_words(["idiot", "asshole", "stupid", "dumb", "moron", "imbecile", "fool", "loser", "freak", "weirdo",
                            "admin", "moderator", "support", "staff", "test", "user"])

# 2. Cast every word to str, then escape
badwords = [str(w) for w in profanity.CENSOR_WORDSET]
escaped = (re.escape(w) for w in badwords)

# 3. Build your whole-word regex
pattern = re.compile(
    r'\b(?:' + '|'.join(escaped) + r')\b',
    flags=re.IGNORECASE
)

spam_pattern = re.compile(r'(.)\1{3,}', re.IGNORECASE)

def is_spam_username(text: str) -> bool:
    return bool(spam_pattern.search(text))


def contains_profanity_whole(text) -> bool:
    # 1) bytes → decode
    if isinstance(text, (bytes, bytearray)):
        text = text.decode('utf-8', errors='ignore')
    # 2) non-str → cast to str
    elif not isinstance(text, str):
        text = str(text)
    # 3) now safe to regex against
    return bool(pattern.search(text))



accounts = Blueprint("accounts", __name__)


@accounts.route("/")
def home():
    return "THIS IS HOME!!!"


@accounts.route("/register", methods=["POST"])
def account_registration():
    # Get username from front-end and perform checks
    data = request.get_json()
    w = contains_profanity_whole(data["newUser"])
    print(w)
    if len(data["newUser"]) == 0:
        return jsonify({"result": "Username is required"}), HTTPStatus.BAD_REQUEST
    elif len(data["newUser"]) < 3:
        return jsonify({"result": "Username must be at least three characters long"}), HTTPStatus.BAD_REQUEST
    elif len(data["newUser"]) > 20:
        return jsonify({"result": "Username is too long. Please enter a username of 20 characters or fewer"}), HTTPStatus.BAD_REQUEST
    elif w or is_spam_username(data["newUser"]):
        return jsonify({"result": "Username is not appropriate. Please try again"}), HTTPStatus.BAD_REQUEST
    user = mongo_db.users.find_one({"username": data["newUser"]})

    if user:
        return jsonify({"result": "Username is taken"}), HTTPStatus.CONFLICT
    user_collection = mongo_db.users
    document = {
        "username": data["newUser"],
    }
    user_collection.insert_one(document).inserted_id
    return jsonify({"result": "Registered succesfully"}), HTTPStatus.CREATED


@accounts.route("/login", methods=["POST"])
def account_login():
    # Get username for existing user and perform checks
    data = request.get_json()
    now = datetime.datetime.now().strftime("%d-%m-%Y")
    hour = datetime.datetime.now().hour
    DAY_TIME = 6
    NIGHT_TIME = 18

    if len(data["existingUser"]) == 0:
        return jsonify({"result": "Username is required"}), HTTPStatus.BAD_REQUEST

    user = mongo_db.users.find_one({"username": data["existingUser"]})
    # If user exists
    # Add login counter to existing user object
    if user is not None:
        login_date = mongo_db.user_login_stats.find_one(
            {"user": user["username"], "login_date": now})
        if DAY_TIME <= hour < NIGHT_TIME:
            time = "day_count"
        else:
            time = "night_count"
        # If current date exists
        # Add counter to same object
        if login_date:
            mongo_db.user_login_stats.update_one(
                {"user": user["username"],
                    "login_date": login_date["login_date"]},
                {"$inc": {"count": 1, time: 1}},
            )
        # Add login counter to new object
        else:
            mongo_db.user_login_stats.insert_one({
                "user": user["username"],
                "login_date": now,
                "count": 1,
                "day_count": 1 if time == "day_count" else 0,
                "night_count": 1 if time == "night_count" else 0,
            })
    else:
        return jsonify({"result": "You have entered an invalid username"}), HTTPStatus.UNAUTHORIZED

    # Create token
    exp = (datetime.datetime.now() + datetime.timedelta(minutes=60)).timestamp()
    payload = {"user": user["username"], "expiration_date": exp}
    jwt_token = jwt.encode(payload=payload, key="revivo", algorithm="HS256")
    return jsonify({"result": "You have been logged in successfully", "token": jwt_token}), HTTPStatus.OK


@accounts.route("/user_login_info", methods=["GET"])
def user_login_info():
    # Extract token from request header
    jwt_token = request.authorization
    token = jwt_token.token
    decoded_token = jwt.decode(token, key="revivo", algorithms=["HS256"])
    user = decoded_token["user"]

    query = {"_id": 0, "username": 1}
    profile_data = mongo_db.users.find_one({"username": user}, query)

    query = {"_id": 0, "user": 1, "login_date": 1,
             "count": 1, "day_count": 1, "night_count": 1}
    stats_data = mongo_db.user_login_stats.find(
        {"user": user}, query)

    day = []
    # Process existing user objects and extract login counters
    for data in stats_data:
        day.append({
            "date": data["login_date"],
            "count": data["count"],
            "day_count": data["day_count"],
            "night_count": data["night_count"]
        })
    
    sorted_day = date_comparison(date_object=day)
    if profile_data:
        pass
    return jsonify({"result": profile_data, "days": sorted_day})


def date_comparison(date_object):
    # Sort by day
    date_format = "%d-%m-%Y"
    sorted_dates = sorted(
        date_object, key=lambda y: datetime.datetime.strptime(y["date"], date_format))
    return sorted_dates
