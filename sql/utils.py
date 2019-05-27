import pymysql as ps
import re

IP = '127.0.0.1'
TABLE_DEFAULT_SETTING = "ID INT NOT NULL, PRIMARY KEY (ID)"


def connect2DB():
    db = ps.connect(host=IP,
                    user='sjtu',
                    port=3306,
                    password='sjtu',
                    db='chinavis',
                    cursorclass=ps.cursors.DictCursor
                    )
    return db


def createTable(db, name, settings=TABLE_DEFAULT_SETTING):
    name = name.upper()
    sqlDrop = "DROP TABLE IF EXISTS {}".format(name) # 若已有则删表
    sqlCreate = "CREATE TABLE {} ({})".format(name, settings)
    cursor = db.cursor()
    cursor.execute(sqlDrop)
    cursor.execute(sqlCreate)


def tableExists(db, tableName):
    sql = "show tables"
    cursor = db.cursor()
    cursor.execute(sql)
    tables = list(cursor.fetchall())
    tableList = re.findall('(\'.*?\')', str(tables))
    tableList = [re.sub("'", '', each) for each in tableList]
    if tableName in tableList:
        return True
    else:
        return False

def insert(db, sql):
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()


def select(db, sql):
    cursor = db.cursor()
    cursor.execute(sql)
    res = cursor.fetchall()
    return res
