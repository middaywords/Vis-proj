"""
    File find_businessman.py created on 2019/6/6 by kangjx
"""

import pandas as pd
import numpy as np


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


if __name__ == '__main__':
    stay_front_row = []

    for i in range(1, 4):

        route = pd.read_csv('data/route{}.csv'.format(i))
        cnt_all_inoneday = []
        for index, row in route.iterrows():
            cnt_in_oneday = 0
            for j in range(1, route.shape[1]):
                if route.iloc[index, j] == 10222 or \
                        route.iloc[index, j] == 10223 or \
                        route.iloc[index, j] == 10224:
                    cnt_in_oneday += 1
            cnt_all_inoneday.append(cnt_in_oneday)
        for item in cnt_all_inoneday:
            stay_front_row.append(item)


