"""
    Classify people by their routes

    File routeClassify.py created on 2019/5/20 by kangjx

    Des
"""

import pandas as pd
import numpy as np


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
            if x == 15 and (y == 5 or y == 15 or y == 17):
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
                return 'other'
                # return 'poster'

            if 4 <= x < 6 and 10 <= y < 12:
                # return 'toilet'
                return 'other'

            if 6 <= x < 10 and 10 <= y < 12:
                # return 'room1'
                return 'other'

            if 10 <= x < 12 and 10 <= y < 12:
                # return 'room2'
                return 'other'

            if 2 <= x < 12 and 15 <= y < 19:
                return 'exhibition'

            if 2 <= x < 12 and 19 <= y < 29:
                return 'mainHall'

            if 12 <= x < 14 and 2 <= y < 6:
                # return 'register'
                return 'other'

            if 14 <= x < 16 and 19 <= y < 21:
                # return 'service'
                return 'other'

            if 14 <= x < 16 and 21 <= y < 25:
                return 'other'
                # return 'room3'

            if 14 <= x < 16 and 25 <= y < 27:
                return 'other'
                # return 'room4'

            if 14 <= x < 16 and 27 <= y < 29:
                return 'other'
                # return 'toilet'

            if x == 1 and 10 <= y < 12:
                # return 'Up'
                # return 'elevator'
                return 'other'

            if x == 14 and 10 <= y < 12:
                # return 'Down'
                # return 'elevator'
                return 'other'

            return 'other'

        else:
            if 2 <= x < 10 and 1 <= y < 6:
                # return 'other'
                return 'diningHall'

            if 10 <= x < 12 and 1 <= y < 6:
                return 'other'
                # return 'room5'

            if 13 <= x and 0 <= y < 6:
                # return 'other'
                return 'recreationArea'

            if 10 <= x < 12 and 4 <= y < 6:
                return 'other'
                # return 'toilet'

            if 10 <= x < 12 and 6 <= y < 8:
                return 'other'
                # return 'room6'

            if x == 1 and 10 <= y < 12:
                return 'other'
                # return 'elevatorUp'

            if x == 14 and 10 <= y < 12:
                return 'other'
                # return 'elevator'

            return 'other'


def split_position_by_minute():
    """
    Input: original day file, numpy list of memeber id.
    :return: positions of every minute
    """
    day1data = pd.read_csv('data/day3.csv')
    day1data = day1data.sort_values(by=['id', 'time'], axis=0)

    id_arr = np.load('data/day3member.npy')
    route_dict = {}
    for item in id_arr:
        route_dict[item] = np.zeros([782])

    last_person_id = day1data.iloc[0, 0]
    last_person_time = 0

    for index, row in day1data.iterrows():
        if row['id'] == last_person_id:
            cur_time = int((row['time']-25200) / 60)
            if last_person_time == 0:
                pass
            else:
                for t in range(last_person_time, cur_time):
                    route_dict[last_person_id][t] = row['sid']
            last_person_time = cur_time
        else:
            last_person_id = row['id']
            last_person_time = 0

    np.save('routeDict.npy', route_dict)


def write_to_csv():
    """
    numpy array of route data
    :return: csv file of route
    """
    www = np.load('routeDict.npy').item()
    f = open("route3.csv", "w+")

    for item in www:
        f.write("%d" % item)
        for num in www[item]:
            f.write(",%d" % num)
        f.write("\n")
    f.close()



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


def compute_distances(data):
    """
    :param route data:
    :return: distances of 2 different id
    """
    distances = np.zeros((data.shape[0], data.shape[0]))
    print('\n-------------------')
    print('dist shape:', distances.shape)
    print('compute distances')
    region = JudgeRegion()
    for i in range(data.shape[0]):
        print(i)
        if i % 300 == 20:
            print('\n----------------')
            print('loop %d, distances:' % i)
            print(distances[i-10:i, 0:10])
        for j in range(data.shape[0]):
            if i == j:
                pass
            elif i > j:
                distances[i, j] = distances[j, i]
                pass
            else:
                for k in range(1, 721):
                    placei = region.getWhere(data.iloc[i, k])
                    placej = region.getWhere(data.iloc[j, k])
                    if placei == placej:
                        pass
                    elif placej == 'other' and placei != 'other':
                        distances[i, j] += 2
                    elif placej != 'other' and placei == 'other':
                        distances[i, j] += 2
                    elif placej != 'other' and placei != 'other':
                        distances[i, j] += 1
    print(distances)
    np.save('dist.npy', distances)
    return distances


def cluster():
    """
    find optimal number of clusters
    :return: num of clusters
    """
    from sklearn.cluster import KMeans
    from sklearn import metrics

    dists = np.load('data/dist.npy')

    acc = {};
    for n_cluster in range(2, 8):
        cluster_model = KMeans(n_clusters=n_cluster)  # 构造聚类器
        labels = cluster_model.fit_predict(dists)
        silhouette = metrics.silhouette_score(dists, labels, metric='euclidean')
        acc[n_cluster] = silhouette

    print(acc)


def get_minute(h, m):
    """

    :param h: hour
    :param m: minute
    :return: relative time to 7:00am
    """
    return (h - 7)*60 + m


def sankey_process():
    """
    generate positions of different point-in-time.
    :return:
    """
    route_data = read_route('route3.csv')
    region = JudgeRegion()
    time_breakpoint = [get_minute(9, 15), get_minute(10, 15), get_minute(11, 15), get_minute(12, 30)]
    print(time_breakpoint)
    # df_to_save = pd.DataFrame(columns=['09-30', '10-00', '11-15', '12-30', '14-30', '16-15', '17-00'])
    pos = pd.DataFrame(columns=list('ABCD'))

    for index, row in route_data.iterrows():
        tmp = []
        for j in range(len(time_breakpoint)):
            t = time_breakpoint[j]
            tmp.append(region.getWhere(route_data.iloc[index, t]))

        tmp_arr = pd.DataFrame([tmp], columns=list('ABCD'))
        pos = pos.append(tmp_arr, ignore_index=True)
        # print(pos)
    pos.to_csv('flow3.csv')


def count_flow():
    """
    Input: positions of different point-in-time
    :return:  flow of different places and points-in-time
    """
    pos = pd.read_csv('flow3.csv')
    locations = ["mainHall", "hallA", "hallB", "hallC", "hallD", "recreationArea", "other", "diningHall", "out", "exhibition"]
    locIndex = {item: index for index, item in enumerate(locations)}
    time_breakpoint = ['09-15', '10-15', '11-15', '12-30']
    count = pd.DataFrame(columns=locations)

    for i in range(1, len(time_breakpoint)):
        flow_cnt = np.zeros([len(locations), len(locations)])
        for index, row in pos.iterrows():
            last_place = pos.iloc[index, i]
            cur_place = pos.iloc[index, i+1]
            flow_cnt[locIndex[last_place], locIndex[cur_place]] += 1
        pd.DataFrame(flow_cnt, columns=locations).to_csv("result/flow3-"+ time_breakpoint[i] + ".csv")


if __name__ == '__main__':

    # generate route data
    # split_position_by_minute()
    # write_to_csv()

    # --- compute distance and find best cluster
    # routeData = read_route()
    # dists_main = compute_distances(routeData)
    # cluster()

    # generate drawing sankey data
    sankey_process()
    count_flow()

