import pandas as pd
from utils import connect2DB, createTable, tableExists, insert, select
from tqdm import tqdm


def storeRaw(db):
    table1 = 'day1csv'
    table2 = 'day2csv'
    table3 = 'day3csv'
    setting = """PID INT NOT NULL,
                SID INT NOT NULL,
                TIME INT NOT NULL
                """
    # PID person id， SID sensor id
    if not tableExists(db, table1):
        day1data = pd.read_csv('../frontend/static/day1.csv')
        createTable(db, table1, setting)
        for _, row in tqdm(day1data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, SID, TIME) VALUES ({},{},{})".format(
                table1, row['id'], row['sid'], row['time'])
            insert(db, sqlInsert)
    if not tableExists(db, table2):
        day2data = pd.read_csv('../frontend/static/day2.csv')
        createTable(db, table2, setting)
        for _, row in tqdm(day2data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, SID, TIME) VALUES ({},{},{})".format(
                table2, row['id'], row['sid'], row['time'])
            insert(db, sqlInsert)
    if not tableExists(db, table3):
        day3data = pd.read_csv('../frontend/static/day3.csv')
        createTable(db, table3, setting)
        for _, row in tqdm(day3data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, SID, TIME) VALUES ({},{},{})".format(
                table3, row['id'], row['sid'], row['time'])
            insert(db, sqlInsert)


def storeRoute(db):
    setting = """PID INT NOT NULL,
                POSITION INT NOT NULL,
                TIME INT NOT NULL
                """
    table1 = 'route1'
    table2 = 'route2'
    table3 = 'route3'
    route1Data = pd.read_csv('../frontend/static/route1.csv', header=None)
    route2Data = pd.read_csv('../frontend/static/route2.csv', header=None)
    route3Data = pd.read_csv('../frontend/static/route3.csv', header=None)
    if not tableExists(db, table1):
        createTable(db, table1, setting)
        for _, row in tqdm(route1Data.iterrows()):
            pid = row[0]
            for idx in range(1, row.shape[0]):
                sqlInsert = "INSERT INTO {}(PID, POSITION, TIME) VALUES ({},{},{})".format(
                    table1, pid, row[idx], idx)
                insert(db, sqlInsert)
    if not tableExists(db, table2):
        createTable(db, table2, setting)
        for _, row in tqdm(route2Data.iterrows()):
            pid = row[0]
            for idx in range(1, row.shape[0]):
                sqlInsert = "INSERT INTO {}(PID, POSITION, TIME) VALUES ({},{},{})".format(
                    table2, pid, row[idx], idx)
                insert(db, sqlInsert)
    if not tableExists(db, table3):
        createTable(db, table3, setting)
        for _, row in tqdm(route3Data.iterrows()):
            pid = row[0]
            for idx in range(1, row.shape[0]):
                sqlInsert = "INSERT INTO {}(PID, POSITION, TIME) VALUES ({},{},{})".format(
                    table3, pid, row[idx], idx)
                insert(db, sqlInsert)

def storeFeatureTotal(db):
    table = 'feature'
    setting = """PID INT NOT NULL, 
                ROOM VARCHAR(255) NOT NULL,
                STAY_TIME FLOAT NOT NULL,
                ROOM4 BOOLEAN NOT NULL,
                ROOM5 BOOLEAN NOT NULL, 
                ROOM6 BOOLEAN NOT NULL,
                ROMES_COUNT FLOAT NOT NULL,
                NO_REGISTER BOOLEAN NOT NULL
                """
    if not tableExists(db, table1):
        day1data = pd.read_csv('../frontend/static/feature.csv')
        day1data.drop(columns=['Unnamed: 0'],inplace=True)
        createTable(db, table1, setting)
        for _, row in tqdm(day1data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, ROOM, STAY_TIME, ROOM4, ROOM5, ROOM6, ROMES_COUNT, NO_REGISTER) VALUES ({},{},{},{},'{}',{},{},{},{},{},{})".format(
                table1, row['id'], row['Room'], row['Stay Time'], row['Been Room4'], row['Been Room5'], row['Been Room6'], row['Rooms Count'], row['No Register'])
            insert(db, sqlInsert)

def storeFeature(db):
    table1 = 'feature1'
    table2 = 'feature2'
    table3 = 'feature3'
    setting = """PID INT NOT NULL, 
                T FLOAT NOT NULL, 
                PIN FLOAT NOT NULL,
                POUT FLOAT NOT NULL,
                ROOM VARCHAR(255) NOT NULL,
                STAY_TIME FLOAT NOT NULL,
                ROOM4 BOOLEAN NOT NULL,
                ROOM5 BOOLEAN NOT NULL, 
                ROOM6 BOOLEAN NOT NULL,
                ROMES_COUNT FLOAT NOT NULL,
                NO_REGISTER BOOLEAN NOT NULL
                """
    # PID person id
    if not tableExists(db, table1):
        day1data = pd.read_csv('../frontend/static/feature1.csv')
        day1data.drop(columns=['Unnamed: 0'],inplace=True)
        createTable(db, table1, setting)
        for _, row in tqdm(day1data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, T, PIN, POUT, ROOM, STAY_TIME, ROOM4, ROOM5, ROOM6, ROMES_COUNT, NO_REGISTER) VALUES ({},{},{},{},'{}',{},{},{},{},{},{})".format(
                table1, row['id'], row['T'], row['in'], row['out'], row['Room'], row['Stay Time'], row['Been Room4'], row['Been Room5'], row['Been Room6'], row['Rooms Count'], row['No Register'])
            insert(db, sqlInsert)
    if not tableExists(db, table2):
        day2data = pd.read_csv('../frontend/static/feature2.csv')
        day2data.drop(columns=['Unnamed: 0'],inplace=True)
        createTable(db, table2, setting)
        for _, row in tqdm(day2data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, T, PIN, POUT, ROOM, STAY_TIME, ROOM4, ROOM5, ROOM6, ROMES_COUNT, NO_REGISTER) VALUES ({},{},{},{},'{}',{},{},{},{},{},{})".format(
                table2, row['id'], row['T'], row['in'], row['out'], row['Room'], row['Stay Time'], row['Been Room4'], row['Been Room5'], row['Been Room6'], row['Rooms Count'], row['No Register'])
            insert(db, sqlInsert)
    if not tableExists(db, table3):
        day3data = pd.read_csv('../frontend/static/feature3.csv')
        day3data.drop(columns=['Unnamed: 0'],inplace=True)
        createTable(db, table3, setting)
        for _, row in tqdm(day3data.iterrows()):
            sqlInsert = "INSERT INTO {}(PID, T, PIN, POUT, ROOM, STAY_TIME, ROOM4, ROOM5, ROOM6, ROMES_COUNT, NO_REGISTER) VALUES ({},{},{},{},'{}',{},{},{},{},{},{})".format(
                table2, row['id'], row['T'], row['in'], row['out'], row['Room'], row['Stay Time'], row['Been Room4'], row['Been Room5'], row['Been Room6'], row['Rooms Count'], row['No Register'])
            insert(db, sqlInsert)


def main():
    db = connect2DB()
    storeRaw(db)
    # storeRoute(db)
    storeFeature(db)
    storeFeatureTotal(db)
    db.close()


if __name__ == "__main__":
    main()
