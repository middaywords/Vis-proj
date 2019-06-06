import pandas as pd
import numpy as np
import json

def write_to_json(ips):
    with open('sid_peoplecount3.json', 'w', encoding='utf-8') as f:
        json.dump(ips, f, indent=4)

with open('sid_peoplecount3.json', 'w', encoding='utf-8') as out:
    out.write("[")
    day1 = pd.read_csv('./data/day3.csv', decimal=',')
    buffer_id = {}
    buffer_sid = {}
    output = {}
    f = open('./data/传感器布置表.csv')
    s_loaction = pd.read_csv(f)
    time = 27120
    for i in range(s_loaction.__len__()):
        buffer_sid[str(s_loaction['sid'][i])] = 0


    for i in range(day1.__len__()-1):

        if buffer_id.get(str(day1['id'][i])) == None:
            buffer_id[str(day1['id'][i])] = day1['sid'][i]
            buffer_sid[str(day1['sid'][i])]+=1

        else:
            buffer_sid[str(buffer_id[str(day1['id'][i])])]-=1
            buffer_id[str(day1['id'][i])] = day1['sid'][i]
            buffer_sid[str(day1['sid'][i])]+=1
        

        if int(day1['time'][i]) <= time and int(day1['time'][i+1]) > time:
            if int(day1['time'][i+1]) < time + 60:
                print(time)
                buffer_sid['time'] = time
                time += 60
                json.dump(buffer_sid, out, indent=4)
                if i != day1.__len__()-1:
                    out.write(",")
                    continue
            else:
                while int(day1['time'][i+1]) > time:
                    print(time)
                    buffer_sid['time'] = time
                    time += 60
                    json.dump(buffer_sid, out, indent=4)
                    if i != day1.__len__()-1:
                        out.write(",")
    out.write("]")