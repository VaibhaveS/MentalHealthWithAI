import pandas as pd
import numpy as np
# import seaborn as sns
import matplotlib.pyplot as plt
import sklearn.cluster as cluster
import pickle
df = pd.read_excel('proj\Cluster_models\divorce.xlsx')

kmeans = cluster.KMeans(n_clusters=5 ,init="k-means++")
kmeans = kmeans.fit(df[['Atr1','Atr2','Atr3','Atr4','Atr5','Atr6','Atr7','Atr8','Atr9','Atr10']])

kmeans.cluster_centers_

df['Cluster'] = kmeans.labels_
print(df.head())

df['Cluster'].value_counts()

pickle.dump(kmeans, open('km.pkl','wb'))