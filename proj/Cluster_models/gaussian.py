import pandas as pd
import numpy as np
# import seaborn as sns
# import matplotlib.pyplot as plt
import sklearn.cluster as cluster
import pickle
from sklearn.mixture import GaussianMixture
df = pd.read_excel('proj\Cluster_models\divorce.xlsx')

df = df[['Atr1','Atr2','Atr3','Atr4','Atr5','Atr6','Atr7','Atr8','Atr9','Atr10']]

gmm = GaussianMixture(n_components=4)
gmm.fit(df)

#predictions from gmm
labels = gmm.predict(df)
frame = pd.DataFrame(df)
frame['cluster'] = labels
print(frame)

pickle.dump(gmm, open('gmm.pkl','wb'))