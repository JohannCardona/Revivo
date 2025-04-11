from flask_pymongo import MongoClient
from configparser import ConfigParser
import os

# Get config object for DB
config = ConfigParser()
# This is where the DB credentials come in
config.read(os.path.abspath(os.path.join(".ini")))  
# Store them in the DB client
database = MongoClient(config["PROD"]["DB_URI"])
# Instantiate DB object to use in other files
mongo_db = database.revivo

