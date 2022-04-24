import pandas as pd
import numpy as np
# import seaborn as sns
import matplotlib.pyplot as plt
import sklearn.cluster as cluster
import pickle
df = pd.read_excel('proj\Cluster_models\divorce.xlsx')
df = df[['Atr9','Atr11','Atr15','Atr17','Atr18','Atr19','Atr20','Atr36','Atr38','Atr40']]
df

import scipy.cluster.hierarchy as shc
dend = shc.dendrogram(shc.linkage(df, method='ward'))

n=3
from sklearn.cluster import AgglomerativeClustering
cluster = AgglomerativeClustering(n_clusters=3, affinity='euclidean', linkage='ward')  

pickle.dump([cluster,n], open('hc.pkl','wb'))