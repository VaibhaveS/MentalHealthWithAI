from matplotlib.pyplot import title
from proj import app
from flask import render_template,url_for,redirect,flash,request
import speech_recognition as sr
from flask import jsonify
from flask import json
import pickle
import nltk
nltk.download('omw-1.4')
import numpy as np
import pandas as pd
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
km = pickle.load(open('km.pkl', 'rb'))
gmm = pickle.load(open('gmm.pkl', 'rb'))
hc = pickle.load(open('hc.pkl', 'rb'))

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
@app.route('/map')
def map():
    return render_template('map.html',title='map')
@app.route('/cluster')
def cluster():
    attr_vals = [[2,2,2,2,1,3,2,1,1,2]]
    grp1 = km.predict(attr_vals)
    print(grp1)

    grp2 = gmm.predict(attr_vals)
    print(grp2)

    pts = pd.read_excel('proj\Cluster_models\divorce.xlsx')
    pts = pts[['Atr9','Atr11','Atr15','Atr17','Atr18','Atr19','Atr20','Atr36','Atr38','Atr40']]
    print(pts)
    pts.loc[len(pts.index)] = [2,2,2,2,1,3,2,1,1,2]
    print(pts)
    clusters = hc.fit_predict(pts)
    grp3 = clusters[-1]
    print(grp3)
    return render_template('cluster.html',title='cluster',grp1 = grp1, grp2 = grp2, grp3 = grp3)
