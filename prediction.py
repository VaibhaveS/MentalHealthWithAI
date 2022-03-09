import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2
from sklearn.feature_selection import f_classif
from flask import request
'''
For purpose of testing I have added this.
Remove the commented out part and process the form details out here
'''

def predict(fr):
    '''
    df = pd.read_csv("proj/Divorce pred ML Models/divorce.csv", sep = ';')
    X = df
    X.head()
    X = X.drop(["Class"], axis = 1)
    X.head()
    y = df["Class"]
    y.head()
    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=0)
    X_train_new = SelectKBest(score_func = f_classif, k=10).fit_transform(x_train, y_train)
    x_train = X_train_new
    x_test_new = SelectKBest(score_func = f_classif, k=10).fit_transform(x_test, y_test)
    '''
    pickle_in = open('proj/Divorce pred ML Models/rfclf', 'rb')

    pickle_clf = pickle.load(pickle_in)
    ans=[]
    #accuracy_pkl = pickle_clf.score(x_test_new, y_test)
    ans.append([fr['q1'],fr['q2'],fr['q3'],fr['q4'],fr['q5'],fr['q6'],fr['q7'],fr['q8'],fr['q9'],fr['q10']])
    
    ans[0]=list(map(int,ans[0]))
    prediction=pickle_clf.predict(ans)[0]
    print(ans)
    #print(fr)
    if prediction==1:
        print("Divorced")
    else:
        print("Not Divorced")
    return prediction
    #print("Accuracy of the model:"+str(accuracy_pkl))
    #print(get_input())
    