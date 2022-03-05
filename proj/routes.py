from matplotlib.pyplot import title
from proj import app
from flask import render_template,url_for,redirect,flash,request
import speech_recognition as sr
from flask import jsonify
from flask import json
import pickle
import nltk
#nltk.download('omw-1.4')
import numpy as np
import pandas as pd
from prediction import predict
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
km = pickle.load(open('km.pkl', 'rb'))
gmm = pickle.load(open('gmm.pkl', 'rb'))
hc = pickle.load(open('hc.pkl', 'rb'))

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
@app.route('/div_pred',methods=['POST','GET'])
def div_pred():
    if request.method=="GET":
        return render_template('div_pred.html',title="Prediction")
    else:
        form_response = {}
        for i in range(1, 11, 1):
            ques = "q" + str(i)
            qi = request.form.get(ques)
            form_response[ques] = qi
        res = str(predict(form_response))
        if(res == "1"):
            res = "Sorry to say that your marriage is not going to last. You can use our therapy system for improving your relationship."
        else:
            res = "Your marriage is going to last. Your relationhsip is strong"
        #redirect("Result.html")
        #print(form_response)
        return render_template('Result.html', Pred_result = res)
@app.route('/emotion')
def emotion():
    return render_template('emotion.html',title='emotion')
@app.route('/map')
def map():
    return render_template('map.html',title='map')
@app.route('/cluster')
def cluster():
    attr_vals = [[2,2,2,2,1,3,2,1,1,2]]

    #km[0] model, km[1] df with clusters col
    #print(km[1])
    t1 = [2,2,2,2,1,3,2,1,1,2]
    grp1 = km[0].predict(attr_vals)
    t1.append(grp1[0])
    km[1].loc[len(km[1].index)] = t1
    # print(type(km[1]))
    print(grp1)
    print(km[1])

    grp2 = gmm[0].predict(attr_vals)
    t2 = [2,2,2,2,1,3,2,1,1,2]
    t2.append(grp2[0])
    gmm[1].loc[len(gmm[1].index)] = t2
    print(grp2)
    print(gmm[1])

    pts = pd.read_excel('proj\Cluster_models\divorce.xlsx')
    pts = pts[['Atr9','Atr11','Atr15','Atr17','Atr18','Atr19','Atr20','Atr36','Atr38','Atr40']]
    #print(pts)
    pts.loc[len(pts.index)] = [2,2,2,2,1,3,2,1,1,2]
    #print(pts)
    clusters = hc[0].fit_predict(pts)
    grp3 = clusters[-1]
    pts['Cluster'] = list(hc[0].labels_)
    #print(grp3)
    print(pts)
    return render_template('cluster.html',title='cluster',grp1 = [grp1,km[1].to_dict(),km[2]], grp2 = [grp2,gmm[1].to_dict(),gmm[2]], grp3 = [grp3,pts.to_dict(),hc[1]])

