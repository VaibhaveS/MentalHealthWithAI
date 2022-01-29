from proj import app
from flask import render_template,url_for,redirect,flash,request
import speech_recognition as sr
from flask import jsonify
from flask import json
# import pickle
# import numpy as np
# import sklearn
# import psycopg2
# from googleapiclient.discovery import build
# from sklearn import preprocessing

@app.route('/')
@app.route('/home')
def home():
   return render_template('home.html',title='Home') 



@app.route('/register',methods=['POST','GET'])
def register():

   return render_template('register.html',title='register')  

@app.route('/login',methods=['POST','GET'])
def login():
   return render_template('login.html',title='login') 