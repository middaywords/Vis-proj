"""
    File inAndOut.py created on 2019/5/21 by kangjx
    Output: Count in and Out for every regions
    Input: positions of data in every minute. route.csv file.
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
        if num == 0:
            return 'other'

        x, y, floor = self.getPara(num)

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
                return 'toilet'

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
                return 'toilet'

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

            if 10 <= x < 12 and 4 <= y < 6:
                # return 'other'
                return 'toilet'

            if 10 <= x < 12 and 6 <= y < 8:
                # return 'other'
                return 'room6'

            if x == 1 and 10 <= y < 12:
                # return 'up'
                return 'elevatorUp'

            if x == 14 and 10 <= y < 12:
                # return 'down'
                return 'elevator'

            return 'other'


def read_route():
    cols = ['id']
    cols = cols + [str(i) for i in range(720)]
    print('\n-------------------')
    print('read csv')
    print(cols)
    print(np.shape(cols))
    data = pd.read_csv('route.csv', names=cols)
    print(data.shape)
    print(data.columns)

    return data


if __name__ == '__main__':
    region = JudgeRegion()
    route = read_route()
    place = 'mainH'
    last_place = np.array(['other' for i in range(route.shape[0])])
    new_place = np.array(['other' for i in range(route.shape[0])])
    place_enter_count = np.zeros(720)
    place_out_count = np.zeros(720)

    print('\n-------------------')
    print('calculate in and out:')
    for t in range(1, 721):
        if t % 100 == 0:
            print('second %d: in_count:%d out_count:%d' % (t, place_enter_count.sum(), place_enter_count.sum()))
        for index, row in route.iterrows():
            # print(index) 0 - 3563
            new_place[index] = region.getWhere(row[t])
            if new_place[index] == place and new_place[index] != last_place[index]:
                place_enter_count[t - 1] += 1
            if last_place[index] == place and new_place[index] != last_place[index]:
                place_out_count[t - 1] += 1
            last_place[index] = new_place[index]
            # if new_place[row[0]] == last_place
            # print(row[t])
            # break
        # break
    print('place out count :', place_out_count)
    print('place enter count:', place_enter_count)

    np.save(place+'_outCount.npy', place_out_count)
    np.save(place+'_inCount.npy', place_enter_count)
