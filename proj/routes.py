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
from tkinter import *
from tkinter import ttk
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
#global confidence
#confidence=0
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
          #print(word)
          return word

@app.route('/tt',methods=['POST','GET'])
def tt():
    if request.method == "POST":
         f = request.files['audio_data']
         ans=func(f)
         print(ans)
         text="i am very angry but i am happy some time angry sad and i feel like dying"
         txl = text.lower()
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
         print(lemmalist)
         edict=dict()
         with open('emotion.txt', 'r') as file:
             for l in file:
                 line_clean = l.replace("\n", '').replace(",", '').replace("'", '').strip()
                 w, val = line_clean.split(':')
                 edict[w.strip()]=val.strip()
                 if val not in k:
                     k.append(val.strip())
         for x in lemmalist:
             for w,val in edict.items():
                 if(x==w):
                     em.append(val)
                     break
         print(em)       
         total=0
         for i in em:
             if(i.strip() not in emotion_dict.keys()):
                 emotion_dict[i.strip()]=1
                 total+=1
             else:
                 emotion_dict[i.strip()]+=1
                 total+=1
         global pos
         global neg
         neg=0
         pos=0
         print(emotion_dict)
         bad=['cheated','singled out','sad','fearful','angry','bored','embarrassed','powerless','hated','apathetic','alone','demoralized','anxious']
         good=['love','attracted','happy','safe','obsessed']
         print(emotion_dict) 
       
         for i,x in emotion_dict.items():
             emotion_dict[i]=x/total
         for i,x in emotion_dict.items():
             if i in bad:
                 neg+=emotion_dict[i]
             if i in good:
                 pos+=emotion_dict[i]
         print(neg)
         print(pos)
         global confidence
         confidence=pos-neg
         t=""
         if(neg>=pos):
             t="Your relationship is not healthy and you need immediate care"
             print("Your relationship is not healthy and you need immediate care")
         else:
             t="you are getting well!"
         win = Tk()
         win.geometry("750x270")
         def open_popup():
             top= Toplevel(win)
             top.geometry("750x250")
             top.title("Confidence display")
             Label(top, text="confidence level: "+str(round(confidence,2))+"\n\n"+t, font=('Helvetica 14 bold')).place(x=150,y=80)
         text="confidence level: "+str(round(confidence,2))
         Label(win,text="Your description: \n"+ ans,font=('Helvetica 14 bold')).pack(pady=20)
         ttk.Button(win, text= "Open", command= open_popup).pack()
         win.mainloop()
         ans=ans+"<br><br>"+t
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