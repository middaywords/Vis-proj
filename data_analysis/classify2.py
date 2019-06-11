"""
    Description:
        map sensor id to different region.

    File classify2.py created on 2019/5/19
    Author: Kangjie Xu
"""

import pandas as pd
import numpy as np


class JudgeRegion():

    def getPara(self, num):
        y = num % 100
        floor = int(num / 10000)
        x = int((num - floor * 10000) / 100)

        return x, y, floor

    def getWhere(self, num):
        x, y, floor = self.getPara(num)

        if floor == 1:
            if 2 <= x < 4 and 1 <= y < 6:
                return 'hall'

            if 4 <= x < 6 and 1 <= y < 6:
                return 'hall'

            if 6 <= x < 8 and 1 <= y < 6:
                return 'hall'

            if 8 <= x < 10 and 1 <= y < 6:
                return 'hall'

            if 3 <= x < 10 and 7 <= y < 9:
                return 'other'
                # return 'poster'

            if 4 <= x < 6 and 10 <= y < 12:
                return 'other'
                # return 'toilet1'

            if 6 <= x < 10 and 10 <= y < 12:
                return 'other'
                # return 'room1'

            if 10 <= x < 12 and 10 <= y < 12:
                return 'other'
                # return 'room2'

            if 2 <= x < 12 and 15 <= y < 19:
                return 'mainHall'

            if 2 <= x < 12 and 19 <= y < 29:
                return 'mainHall'

            if 12 <= x < 14 and 2 <= y < 6:
                return 'other'
                # return 'register'

            if 14 <= x < 16 and 19 <= y < 21:
                return 'other'
                # return 'service'

            if 14 <= x < 16 and 21 <= y < 25:
                return 'other'
                # return 'room3'

            if 14 <= x < 16 and 25 <= y < 27:
                return 'other'
                # return 'room4'

            if 14 <= x < 16 and 27 <= y < 29:
                return 'other'
                # return 'toilet2'

            if x == 1 and 10 <= y < 12:
                return 'other'
                # return 'elevatorUp'

            if x == 14 and 10 <= y < 12:
                return 'other'
                # return 'elevatorDown'

            return 'other'

        else:
            if 2 <= x < 10 and 1 <= y < 6:
                return 'other'
                # return 'diningHall'

            if 10 <= x < 12 and 1 <= y < 6:
                return 'other'
                # return 'room5'

            if 13 <= x and 0 <= y < 6:
                return 'other'
                # return 'recreationArea'

            if 10 <= x < 12 and 4 <= y < 6:
                return 'other'
                # return 'toilet3'

            if 10 <= x < 12 and 6 <= y < 8:
                return 'other'
                # return 'room6'

            if x == 1 and 10 <= y < 12:
                return 'other'
                # return 'elevatorUp'

            if x == 14 and 10 <= y < 12:
                return 'other'
                # return 'elevatorDown'

            return 'other'


if __name__ == '__main__':
    getPlace = JudgeRegion()
    day1member = np.load('day1member.npy')
    sid_cache = {}
    place = {}
    for item in day1member:
        print(item)
        sid_cache[item] = 0
        place[item] = []

    day1series = pd.read_csv('data/day1.csv')
    start_time = 25240
    cur_end_time = 28800

    while cur_end_time < 65000:
        for index, row in day1series.iterrows():
            if row['time'] > cur_end_time:
                break
            sid_cache[row['id']] = row['sid']

        for item in day1member:
            if sid_cache[item] == 0:
                place[item].append('out')
            else:
                place[item].append(getPlace.getWhere(sid_cache[item]))

        cur_end_time += 3600

    np.save('day1RouteArrayV2.npy', place)


