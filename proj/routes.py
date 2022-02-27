from proj import app
from flask import render_template,url_for,redirect,flash,request
import speech_recognition as sr
from flask import jsonify
from flask import json
import pickle
import nltk
nltk.download('omw-1.4')
# import numpy as np
# import sklearn
import psycopg2
# from googleapiclient.discovery import build
from sklearn import preprocessing
import text2emotion as em
#import tkinter as tk
import string
from collections import Counter
from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html',title='Home')

ans=''

def func(f):
        with open(r'aud.wav','wb') as audio:
            f.save(audio)
        print('file uploaded successfully')
        r=sr.Recognizer()
        filename = r"aud.wav"
        with sr.AudioFile(filename) as source:
          audio_data = r.record(source)
          word = r.recognize_google(audio_data)
          word=word.strip()
          word=word.lower()
          print(word)
          return word

@app.route('/tt',methods=['POST','GET'])
def tt():
    if request.method == "POST":
         f = request.files['audio_data']
         ans=func(f)
         print(ans)
         #text="I am distressed and depressed. My relationship is very bad and i am hurt. i am angry"
         txl = ans.lower()
         txpunc = txl.translate(str.maketrans('', '', string.punctuation))
         tokens = word_tokenize(txpunc, "english")
         wordlist = []
         lemmalist = []
         for w in tokens:
             if w not in stopwords.words('english'):
                 wordlist.append(w)
         for w in wordlist:
            w = WordNetLemmatizer().lemmatize(w)
            lemmalist.append(w)
         emotion_dict = dict() 
         em=[]
         ct=0
         k=[]
         with open('emotion.txt', 'r') as file:
             for l in file:
                 line_clean = l.replace("\n", '').replace(",", '').replace("'", '').strip()
                 w, val = line_clean.split(':')
                 if val not in k:
                     k.append(val)
                 if w in lemmalist:
                     em.append(val)
         print(em)
         print(k)
         total=0
         for i in em:
             if(i.strip() not in emotion_dict.keys()):
                 emotion_dict[i.strip()]=1
                 total+=1
             else:
                 emotion_dict[i.strip()]+=1
                 total+=1
         for i,x in emotion_dict.items():
             emotion_dict[i]=x/total
         print(emotion_dict)  
         #a=em.get_emotion(ans)
         #print(a)
         s=""
         #root = tk()
         # specify size of window.
         #root.geometry("250x170")
         #if(a['Angry']!=0 or a['Sad']!=0 or a['Fear']!=0):
         #    s="Anger: "+str(a['Angry'])+"         Sad: "+str(a['Sad'])+"     Fear: "+str(a['Fear'])
         #    ans=ans+"     "+s
         #else:
         #    ans=ans+"        You are getting well!"
         return jsonify(ans)

@app.route('/main_js',methods=['POST','GET'])
def main_js():
   return render_template("/js/main.js")
@app.route('/div_pred')
def div_pred():
        return render_template('div_pred.html',title="Prediction")
@app.route('/emotion')
def emotion():
    return render_template('emotion.html',title='emotion')