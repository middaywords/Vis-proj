import pandas as pd
import numpy as np
import json

def getPara(num):
        y = num % 100
        floor = int(num / 10000)
        x = int((num - floor * 10000) / 100)

        return x, y, floor
    
def getWhere(num):
    if num == 0:
        return 'other'

    x, y, floor = getPara(num)

    if floor == 1:
        if 2 <= x < 4 and 1 <= y < 6:
            return 'hallA'

        if 4 <= x < 6 and 1 <= y < 6:
            return 'hallB'

        if 6 <= x < 8 and 1 <= y < 6:
            return 'hallC'

        if 8 <= x < 10 and 1 <= y < 6:
            return 'hallD'

        if 3 <= x < 10 and 7 <= y < 9:
            return 'poster'

        if 4 <= x < 6 and 10 <= y < 12:
            return 'toilet1'

        if 6 <= x < 10 and 10 <= y < 12:
            return 'room1'

        if 10 <= x < 12 and 10 <= y < 12:
            return 'room2'

        if 2 <= x < 12 and 15 <= y < 19:
            return 'exhibition'

        if 2 <= x < 12 and 19 <= y < 29:
            return 'mainHall'

        if 12 <= x < 14 and 2 <= y < 6:
            return 'register'

        if 14 <= x < 16 and 19 <= y < 21:
            return 'service'

        if 14 <= x < 16 and 21 <= y < 25:
            # return 'other'
            return 'room3'

        if 14 <= x < 16 and 25 <= y < 27:
            # return 'other'
            return 'room4'

        if 14 <= x < 16 and 27 <= y < 29:
            # return 'other'
            return 'toilet2'

        if x == 1 and 10 <= y < 12:
            # return 'Up'
            return 'elevator'

        if x == 14 and 10 <= y < 12:
            # return 'Down'
            return 'elevator'

        return 'other'

    else:
        if 2 <= x < 10 and 1 <= y < 6:
            # return 'other'
            return 'diningHall'

        if 10 <= x < 12 and 1 <= y < 6:
            # return 'other'
            return 'room5'

        if 13 <= x and 0 <= y < 6:
            # return 'other'
            return 'recreationArea'

        if 10 <= y < 12 and 4 <= x < 6:
            # return 'other'
            return 'toilet3'

        if 10 <= y < 12 and 6 <= x < 8:
            # return 'other'
            return 'room6'

        if x == 1 and 10 <= y < 12:
            # return 'up'
            return 'elevatorUp'

        if x == 14 and 10 <= y < 12:
            # return 'down'
            return 'elevator'

        return 'other'

if __name__ == "__main__":
    files = [
        'data/day1.csv',
        'data/day2.csv',
        'data/day3.csv'
    ]
    
    df_day1 = pd.read_csv(files[0])
    df_day2 = pd.read_csv(files[1])
    df_day3 = pd.read_csv(files[2])
    f = open('./data/传感器布置表.csv')
    s_loaction = pd.read_csv(f)
    
    with open('sid_people_in3.json', 'w', encoding='utf-8') as people_in:
        with open('sid_people_out3.json', 'w', encoding='utf-8') as people_out:
            people_out.write("[")
            people_in.write("[")
        
            day1_x_y = pd.merge(df_day3, s_loaction, validate="many_to_one")
            # 根据id和time来对数据进行排序
            day1_sortBy_id_and_time = day1_x_y .sort_values(by=["id", "time"], axis=0)
            # 重建索引
            day1_sortBy_id_and_time.index = np.arange(day1_sortBy_id_and_time.__len__())
            timeStart = int(3600*7)
            timeEnd = int(18*3600)
            time = timeStart
            while (time >= timeStart) & (time <= timeEnd):
                dict_in = {'time' : 0,
                        'other' : 0,
                        'hallA' : 0,
                        'hallB' : 0,
                        'hallC' : 0,
                        'hallD' : 0,
                        'poster' : 0,
                        'toilet1' : 0,
                        'toilet2' : 0,
                        'toilet3' : 0,
                        'room1' : 0,
                        'room2' : 0,
                        'exhibition' : 0,
                        'mainHall' : 0,
                        'register' : 0,
                        'service' : 0,
                        'room3' : 0,
                        'room4' : 0,
                        'elevator' : 0,
                        'diningHall' : 0,
                        'room5' : 0,
                        'recreationArea' : 0,
                        'room6' : 0,
                        'elevatorUp' : 0}
                
                dict_out = {'time' : 0,
                        'other' : 0,
                        'hallA' : 0,
                        'hallB' : 0,
                        'hallC' : 0,
                        'hallD' : 0,
                        'poster' : 0,
                        'toilet1' : 0,
                        'toilet2' : 0,
                        'toilet3' : 0,
                        'room1' : 0,
                        'room2' : 0,
                        'exhibition' : 0,
                        'mainHall' : 0,
                        'register' : 0,
                        'service' : 0,
                        'room3' : 0,
                        'room4' : 0,
                        'elevator' : 0,
                        'diningHall' : 0,
                        'room5' : 0,
                        'recreationArea' : 0,
                        'room6' : 0,
                        'elevatorUp' : 0}
                
                nextTime = time + 60
                tmp_id = day1_sortBy_id_and_time.iloc[0].id
                # 从按照id,时间和楼层组合中取出slice
                data = day1_sortBy_id_and_time[(day1_sortBy_id_and_time['time']<= nextTime) & (day1_sortBy_id_and_time['time'] >= time)]
                for i in range(data.__len__()):
                    if data.iloc[i].id != tmp_id:
                        # 开始计算当前id进出场馆情况
                        tmp_id = data.iloc[i].id
                        # 判断该id上一次是否在场馆中
                        if data.iloc[i].name - 1 >= 0:
                            pre_sid = day1_sortBy_id_and_time.iloc[data.iloc[i].name - 1].sid
                        else:
                            pre_sid = day1_sortBy_id_and_time.iloc[0].id
                        
                        # 之前就在场馆
                        if tmp_id != day1_sortBy_id_and_time.iloc[0].id and getWhere(int(pre_sid)) != getWhere(int(data.iloc[i].sid)):
                            dict_in[getWhere(int(data.iloc[i].sid))] += 1
                            dict_out[getWhere(int(pre_sid))] += 1
                        # 才进门
                        if tmp_id == day1_sortBy_id_and_time.iloc[0].id:
                            dict_in[getWhere(int(data.iloc[i].sid))] += 1
                    
                    else:
                        if getWhere(int(data.iloc[i - 1].sid)) != getWhere(int(data.iloc[i].sid)):
                            dict_in[getWhere(int(data.iloc[i].sid))] += 1
                            dict_out[getWhere(int(data.iloc[i - 1].sid))] += 1
                
                dict_in['time'] = time
                dict_out['time'] = time

                json.dump(dict_in, people_in, indent=4)
                people_in.write(",")

                json.dump(dict_out, people_out, indent=4)
                people_out.write(",")
                
                print(time)
                time = nextTime
                
            people_in.write("]")
            people_out.write("]")
                
            
            



'''
with open('sid_peopleinandout.json', 'w', encoding='utf-8') as out:
    out.write("[")
    day1 = pd.read_csv('./data/day1.csv', decimal=',')
    buffer_id = {}
    buffer_sid = {}
    output = {}
    f = open('./data/传感器布置表.csv')
    s_loaction = pd.read_csv(f)
    time = 25260
    for i in range(s_loaction.__len__()):
        buffer_sid[str(s_loaction['sid'][i])+"in"] = 0
        buffer_sid[str(s_loaction['sid'][i])+"out"] = 0


    for i in range(day1.__len__()-1):

        if buffer_id.get(str(day1['id'][i])) == None:
            buffer_id[str(day1['id'][i])] = day1['sid'][i]
            buffer_sid[str(day1['sid'][i])+"in"]+=1

        else:
            buffer_sid[str(buffer_id[str(day1['id'][i])])+"out"]+=1
            buffer_id[str(day1['id'][i])] = day1['sid'][i]
            buffer_sid[str(day1['sid'][i])+"in"]+=1
        

        if int(day1['time'][i]) <= time and int(day1['time'][i+1]) > time:
            if int(day1['time'][i+1]) < time + 60:
                print(time)
                buffer_sid['time'] = time
                time += 60
                json.dump(buffer_sid, out, indent=4)
                for j in range(s_loaction.__len__()):
                    buffer_sid[str(s_loaction['sid'][j])+"in"] = 0
                    buffer_sid[str(s_loaction['sid'][j])+"out"] = 0
                if i != day1.__len__()-1:
                    out.write(",")
                    continue
            else:
                while int(day1['time'][i+1]) > time:
                    print(time)
                    buffer_sid['time'] = time
                    time += 60
                    json.dump(buffer_sid, out, indent=4)
                    for j in range(s_loaction.__len__()):
                        buffer_sid[str(s_loaction['sid'][j])+"in"] = 0
                        buffer_sid[str(s_loaction['sid'][j])+"out"] = 0
                    if i != day1.__len__()-1:
                        out.write(",")
    out.write("]")
'''