import pandas as pd
import numpy as np
# import seaborn as sns
# import matplotlib.pyplot as plt
import sklearn.cluster as cluster
import pickle
from sklearn.mixture import GaussianMixture
df = pd.read_excel('proj\Cluster_models\divorce.xlsx')

df = df[['Atr9','Atr11','Atr15','Atr17','Atr18','Atr19','Atr20','Atr36','Atr38','Atr40']]

gmm = GaussianMixture(n_components=4)
gmm.fit(df)

#predictions from gmm
labels = gmm.predict(df)
frame = pd.DataFrame(df)
frame['cluster'] = labels
print(frame)

pickle.dump([gmm,frame], open('gmm.pkl','wb'))