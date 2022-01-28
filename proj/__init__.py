
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from urllib.parse import quote  
from sqlalchemy.engine import create_engine
app=Flask(__name__)

from proj import routes