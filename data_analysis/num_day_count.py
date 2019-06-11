import pandas as pd
import numpy as np


for i in range(1, 3):
    file_path = 'data/day' + str(i+1) + '.csv'
    save_path = 'data/day' + str(i+1) + 'member.npy'
    data = pd.read_csv(file_path)
    dic = {}
    for index, row in data.iterrows():
        dic[row['id']] = 1
    print(file_path, len(dic.keys()))
    np.save(save_path, np.array(sorted(list(dic.keys()))))