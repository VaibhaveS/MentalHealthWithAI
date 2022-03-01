import pandas as pd
import numpy as np
# import seaborn as sns
import matplotlib.pyplot as plt
import sklearn.cluster as cluster
import pickle
df = pd.read_excel('proj\Cluster_models\divorce.xlsx')
df = df[['Atr9','Atr11','Atr15','Atr17','Atr18','Atr19','Atr20','Atr36','Atr38','Atr40']]

kmeans = cluster.KMeans(n_clusters=5 ,init="k-means++")
kmeans = kmeans.fit(df)

kmeans.cluster_centers_

df['Cluster'] = kmeans.labels_
print(df.head())

print(df['Cluster'].value_counts())

pickle.dump([kmeans,df], open('km.pkl','wb'))