from flask import Blueprint, request, jsonify
from http import HTTPStatus
from db.db import mongo_db
import jwt
from dotenv import load_dotenv
import datetime

accounts = Blueprint("accounts", __name__)
load_dotenv()


@accounts.route("/")
def home():
    return "THIS IS HOME!!!"


@accounts.route("/register", methods=["POST"])
def account_registration():
    data = request.get_json()

    print("DATA: \n", data)

    if len(data["newUser"]) == 0:
        return jsonify({"result": "Username is required"}), HTTPStatus.BAD_REQUEST
    elif len(data["newUser"]) < 3:
        return jsonify({"result": "Username must be at least three characters long"}), HTTPStatus.BAD_REQUEST
    user = mongo_db.users.find_one({"username": data["newUser"]})
    print(user)
    if user:
        return jsonify({"result": "Username is taken"}), HTTPStatus.CONFLICT

    collection = mongo_db.users
    document = {
        "username": data["newUser"],
    }
    collection.insert_one(document).inserted_id

    return jsonify({"result": "Registered succesfully"}), HTTPStatus.CREATED


@accounts.route("/login", methods=["POST"])
def account_login():
    data = request.get_json()
    print(data)
    now = datetime.datetime.now().strftime("%d-%m-%Y")
    hour = datetime.datetime.now().hour
    DAY_TIME = 6
    NIGHT_TIME = 18

    if len(data["existingUser"]) == 0:
        return jsonify({"result": "Username is required"}), HTTPStatus.BAD_REQUEST

    user = mongo_db.users.find_one({"username": data["existingUser"]})
    print(user)

    login_date = mongo_db.user_login_stats.find_one(
        {"user": user["username"], "login_date": now})

    if user is not None:
        if DAY_TIME <= hour < NIGHT_TIME:
            time = "day_count"
        else:
            time = "night_count"
        if login_date:
            mongo_db.user_login_stats.update_one(
                {"user": user["username"],
                    "login_date": login_date["login_date"]},
                {"$inc": {"count": 1, time: 1}},
            )
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

    exp = (datetime.datetime.now() + datetime.timedelta(minutes=60)).timestamp()
    payload = {"user": user["username"], "expiration_date": exp}
    jwt_token = jwt.encode(payload=payload, key="revivo", algorithm="HS256")

    return jsonify({"result": "You have been logged in successfully", "token": jwt_token}), HTTPStatus.OK


@accounts.route("/user_login_info", methods=["GET"])
def user_login_info():
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
    for data in stats_data:
        print(data)
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
    date_format = "%d-%m-%Y"
    sorted_dates = sorted(date_object, key=lambda y: datetime.datetime.strptime(y["date"], date_format))
    return sorted_dates
