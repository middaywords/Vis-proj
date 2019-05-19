
import pandas as pd


for i in range(3):
	file_path = '../data/day' + str(i) + '.csv'
	data = pd.read_csv('data/day3.csv')
	dic = {}
		for index, row in data.iterrows():
			dic[row['id']] = 1;
	print(file_path, len(dic.keys()))