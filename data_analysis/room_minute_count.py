"""
    File room_minute_count.py created on 2019/6/6 by kangjx
"""

import numpy as np
import pandas as pd
import json

class JudgeRegion():
    """
    used to detect region for sid
    """
    def getPara(self, num):
        y = num % 100
        floor = int(num / 10000)
        x = int((num - floor * 10000) / 100)

        return x, y, floor

    def getWhere(self, num):
        if num == 0:
            return 'out'

        x, y, floor = self.getPara(num)

        if floor == 1:
            if x == 15 and (y == 5 or y == 15 or y == 17) or x == 0 and y == 19:
                return 'out'

            if 2 <= x < 4 and 1 <= y < 6:
                return 'hallA'

            if 4 <= x < 6 and 1 <= y < 6:
                return 'hallB'

            if 6 <= x < 8 and 1 <= y < 6:
                return 'hallC'

            if 8 <= x < 10 and 1 <= y < 6:
                return 'hallD'

            if 3 <= x < 10 and 7 <= y < 9:
                # return 'other'
                return 'poster'

            if 4 <= x < 6 and 10 <= y < 12:
                return 'toilet1'
                # return 'other'

            if 6 <= x < 10 and 10 <= y < 12:
                return 'room1'
                # return 'other'

            if 10 <= x < 12 and 10 <= y < 12:
                return 'room2'
                # return 'other'

            if 2 <= x < 12 and 15 <= y < 19:
                return 'exhibition'

            if 2 <= x < 12 and 19 <= y < 29:
                return 'mainHall'

            if 12 <= x < 14 and 2 <= y < 6:
                return 'register'
                # return 'other'

            if 14 <= x < 16 and 19 <= y < 21:
                return 'service'
                # return 'other'

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
                return 'elevatorUp'
                # return 'other'

            if x == 14 and 10 <= y < 12:
                # return 'Down'
                return 'elevator'
                # return 'other'

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

            if 4 <= x < 6 and 10 <= y < 12:
                # return 'other'
                return 'toilet3'

            if 6 <= x < 8 and 10 <= y < 12:
                # return 'other'
                return 'room6'

            if x == 1 and 10 <= y < 12:
                # return 'other'
                return 'elevatorUp'

            if x == 14 and 10 <= y < 12:
                # return 'other'
                return 'elevator'

            return 'other'


def read_route(file_name):
    """
    :param file_name: csv file name
    :return: route data
    """
    cols = ['id']
    cols = cols + [str(i) for i in range(782)]
    print('\n-------------------')
    print('read csv')
    print('cols:', cols)
    print('cols shape:', np.shape(cols))
    data = pd.read_csv(file_name, names=cols)
    print('data shape:', data.shape)
    print('data cols:', data.columns)

    return data


class PeopleClassify():

    def __init__(self):
        with open('cluster.json') as json_file:
            self.cluster = json.load(json_file)
        print(self.cluster.keys())

    def judge_ptype(self, id):
        if id in self.cluster['VIP']:
            return 0   # specialist
        elif id in self.cluster['newsman']:
            return 1
        elif id in self.cluster['staff']:
            return 2
        elif id in self.cluster['specialist']:
            return 3
        elif id in self.cluster['exhibitor']:
            return 4
        else:
            return 5


def room_minute_count():
    region = JudgeRegion()
    p_type = PeopleClassify()
    rec_dicts = []
    for i in range(1, 4):
        file_name = 'data/route{}.csv'.format(i)

        route_data = read_route(file_name)
        room_peopletypecount = []
        for j in range(route_data.shape[1]):
            if j % 100 == 0:
                print(j)
            people_type_count_timepoint = {}
            for index, row in route_data.iterrows():
                s = region.getWhere(route_data.iloc[index, j])
                if s == 'out':
                    continue
                if s not in people_type_count_timepoint.keys():
                    people_type_count_timepoint[s] = [0 for k in range(6)]
                sp_type = p_type.judge_ptype(str(route_data.iloc[index, 0]))
                people_type_count_timepoint[s][sp_type] += 1
            room_peopletypecount.append(people_type_count_timepoint)
        print(room_peopletypecount)
        rec_dicts.append(room_peopletypecount)

    with open('room_minute_count_0609.json', 'w') as json_file:
        json.dump(rec_dicts, json_file)

def person_room_count():

    region = JudgeRegion()
    p_type = PeopleClassify()
    person_word_count = {}
    for i in range(1, 4):
        file_name = 'data/route{}.csv'.format(i)

        route_data = read_route(file_name)

        for index, row in route_data.iterrows():
            if index % 300 == 0:
                print(index)
            person_word_dict = {}
            for j in range(route_data.shape[1]):
                s = region.getWhere(route_data.iloc[index, j])
                if s == 'out':
                    continue
                if s not in person_word_dict.keys():
                    person_word_dict[s] = 0
                person_word_dict[s] += 1
            id = str(route_data.iloc[index, 0])
            if id in person_word_count.keys():
                tmpdict = person_word_count[id]
                for key, value in person_word_dict.items():
                    if key in tmpdict.keys():
                        tmpdict[key] += person_word_dict[key]
                    else:
                        tmpdict[key] = person_word_dict[key]
            else:
                tmpdict = person_word_dict
            person_word_count[id] = tmpdict



    with open('person_room_count.json', 'w') as json_file:
        json.dump(person_word_count, json_file)


if __name__ == '__main__':
    room_minute_count()