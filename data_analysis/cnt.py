"""

import pandas as pd

day_data = pd.read_csv('data/day1.csv')
id_rec = {}
for index, row in day_data.iterrows():
    if row['time'] <= 28800  and (row['sid'] == 10515 or row['sid'] == 10815 or row['sid'] == 11115 or
        row['sid'] == 10518 or row['sid'] == 10818 or row['sid'] == 11118):
        id_rec[row['id']] = 1
    if index > 28800:
    	break
print(id_rec.keys())
"""

import json

with open('bubble.json', 'w') as json_file:
