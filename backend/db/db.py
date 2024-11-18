from flask_pymongo import MongoClient
from configparser import ConfigParser
import os

config = ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))  
database = MongoClient(config["PROD"]["DB_URI"])
mongo_db = database.revivo

