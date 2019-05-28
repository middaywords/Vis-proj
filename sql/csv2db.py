import pandas as pd
from utils import connect2DB, createTable, tableExists, insert, select
from tqdm import tqdm


def storeRaw(db):
    day1name = 'day1csv'
    day2name = 'day2csv'
    day3name = 'day3csv'
    rawSetting = """PID INT NOT NULL,
                    SID INT NOT NULL,
                    TIME INT NOT NULL
                    """
    # PID person id， SID sensor id
    if not tableExists(db, day1name):
        day1data = pd.read_csv('../static/day1.csv')
        createTable(db, day1name, rawSetting)
        for _, row in tqdm(day1data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, SID, TIME) VALUES ({},{},{})".format(
                day1name, row['id'], row['sid'], row['time'])
            insert(db, sqlInsert)
    if not tableExists(db, day2name):
        day2data = pd.read_csv('../static/day2.csv')
        createTable(db, day2name, rawSetting)
        for _, row in tqdm(day2data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, SID, TIME) VALUES ({},{},{})".format(
                day2name, row['id'], row['sid'], row['time'])
            insert(db, sqlInsert)
    if not tableExists(db, day3name):
        day3data = pd.read_csv('../static/day3.csv')
        createTable(db, day3name, rawSetting)
        for _, row in tqdm(day3data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, SID, TIME) VALUES ({},{},{})".format(
                day3name, row['id'], row['sid'], row['time'])
            insert(db, sqlInsert)


def storeRoute(db):
    routeSetting = """PID INT NOT NULL,
                    POSITION INT NOT NULL,
                    TIME INT NOT NULL
                    """
    route1Name = 'route1'
    route2Name = 'route2'
    route3Name = 'route3'
    route1Data = pd.read_csv('../static/route1.csv', header=None)
    route2Data = pd.read_csv('../static/route2.csv', header=None)
    route3Data = pd.read_csv('../static/route3.csv', header=None)
    if not tableExists(db, route1Name):
        createTable(db, route1Name, routeSetting)
        for _, row in tqdm(route1Data.iterrows()):
            pid = row[0]
            for idx in range(1, row.shape[0]):
                sqlInsert = "INSERT INTO {}(PID, POSITION, TIME) VALUES ({},{},{})".format(
                    route1Name, pid, row[idx], idx)
                insert(db, sqlInsert)
    if not tableExists(db, route2Name):
        createTable(db, route2Name, routeSetting)
        for _, row in tqdm(route2Data.iterrows()):
            pid = row[0]
            for idx in range(1, row.shape[0]):
                sqlInsert = "INSERT INTO {}(PID, POSITION, TIME) VALUES ({},{},{})".format(
                    route2Name, pid, row[idx], idx)
                insert(db, sqlInsert)
    if not tableExists(db, route3Name):
        createTable(db, route3Name, routeSetting)
        for _, row in tqdm(route3Data.iterrows()):
            pid = row[0]
            for idx in range(1, row.shape[0]):
                sqlInsert = "INSERT INTO {}(PID, POSITION, TIME) VALUES ({},{},{})".format(
                    route3Name, pid, row[idx], idx)
                insert(db, sqlInsert)


def main():
    db = connect2DB()
    storeRaw(db)
    storeRoute(db)
    db.close()


if __name__ == "__main__":
    main()
