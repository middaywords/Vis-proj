"""
    File test.py created on 2019/5/20 by kangjx
"""

import numpy as np
import pandas as pd


def writeToCsv():
    www = np.load('routeDict.npy').item()
    f = open("guru99.csv", "w+")

    for item in www:
        f.write("%d" % item)
        for num in www[item]:
            f.write(",%d" % num)
        f.write("\n")
    f.close()


def tryPandasRead():
    cols = ['id']
    cols = cols + [str(i) for i in range(720)]
    print(cols)
    print(np.shape(cols))
    data = pd.read_csv('guru99.csv', names=cols)
    print(data.shape)
    print(data.columns)


if __name__ == '__main__':
    a = 'sssssss'
    b = 'aaa'
    b = a
    print(b)
