import pandas as pd
import numpy as np

data = pd.read_csv('data/day1.csv')

# for index, row in data.iterrows():
#     print(index)
#     if row['time'] > 28800:
#         break

member = np.load("day1member.npy")
x = np.load("day1RouteArrayV2.npy")

x = x.item()
print(len(x))

str_dict = {}
for i in x:
    tmp_str = ''
    for s in x[i]:
        tmp_str += s
    print(tmp_str)
    if tmp_str in str_dict:
        str_dict[tmp_str] += 1
    else:
        str_dict[tmp_str] = 1

print(len(str_dict.keys()))
