"""
    File Utils.py created on 2019/6/7 by kangjx
"""

# delete columns 
# why not go to excel
for i in range(1, 4):
    tdf = pd.read_csv('regulization' + str(i) + '.csv')
    tdf = tdf.drop(columns=['del1', 'del2'])
    tdf.to_csv('regulization{}.csv'.format(i))

# write json
with open('room_minute_count_0609.json', 'w') as json_file:
    json.dump(rec_dicts, json_file)

# read json
with open('data/staff/staff_count_all.json') as json_file: 
    a = json.load(json_file)
