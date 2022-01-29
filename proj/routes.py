from proj import app
from flask import render_template,url_for,redirect,flash,request
# import speech_recognition as sr
# from flask import jsonify
# from flask import json
# import pickle
# import numpy as np
# import sklearn
# import psycopg2
# from googleapiclient.discovery import build
# from sklearn import preprocessing

@app.route('/')
@app.route('/home')
def home():
    return render_template('html/home.html',title='Home')