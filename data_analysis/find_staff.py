"""
    File find_staff.py created on 2019/5/27 by kangjx
"""

import pandas as pd
import numpy as np

import matplotlib.pyplot as plt
from matplotlib import style
style.use('ggplot')

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
    data = pd.read_csv(file_name, names=cols).fillna(0).astype('int32')
    print('data shape:', data.shape)
    print('data cols:', data.columns)

    return data


def process_route():
    route_data = read_route('data/route1.csv')

    pos = np.zeros(route_data.shape[0])
    for j in range(1, len(route_data.columns)):
        for index, row in route_data.iterrows():
            if route_data.iloc[index, j] != pos[index]:
                if route_data.iloc[index, j] != 0:
                    pos[index] = route_data.iloc[index, j]
                else:
                    route_data.iloc[index, j] = pos[index]
    route_data.to_csv('data/route_new1.csv')


if __name__ == '__main__':
    process_route()
