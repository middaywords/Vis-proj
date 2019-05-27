import pandas as pd
import os
from collections import Counter

os.chdir('..')

if __name__ == "__main__":
    ids = list()
    for day in range(1,4):
        today = pd.read_csv("static/day{}.csv".format(day))
        ids.extend(today['id'])
    ids = Counter(ids)
    newsman = ids.most_common(100)

