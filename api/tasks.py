
import schedule
import time, threading
import logging
import os
import tempfile
import json
import oss2
from api.configure import configure
from django.db import connection, transaction
from api.service import service as apiService
logger = logging.getLogger("tasks")


def updateMapData():
    print("update map data")
    # load data
    cursor = connection.cursor()
    cursor.execute( \
            "select iwhere, igps, igpswhere "+\
            "FROM api_item i where status_remove = 0 "+\
            "order by id"\
        )
    areaMap = {}
    for row in cursor.fetchall():
        iwhere = row[0]
        igps = row[1]
        igpswhere = row[2]
        #
        # let key = igpswhere if igpswhere != '陕西省' or igpswhere != '陕西省,,' else '陕西省,西安市,莲湖区'
        # let gps = igps if igps != '' else '108.9533138360,34.2655919355'
        if igpswhere == '陕西省' or igpswhere == '陕西省,,':
            if (iwhere == '陕西省' or iwhere == '陕西省,,'):
                igpswhere = '陕西省,西安市,莲湖区'
            else :
                igpswhere = iwhere
        if igpswhere not in areaMap:
            areaMap[igpswhere] = []
        if (igps != '' or igps.find(",") >= 0):
            areaMap[igpswhere].extend([[ \
                float(igps.split(",")[0]), \
                float(igps.split(",")[1]), \
            ]])
        else:
            defLocalKey = iwhere[0:igpswhere.rfind(",")]
            if (defLocalKey in configure.defLocalGPS):
                areaMap[igpswhere].extend([configure.defLocalGPS[defLocalKey]])
    areaMapJson = json.dumps({'areas' : areaMap}, ensure_ascii=False)
    # temp file
    needUpload = False
    tmpfile = os.path.join ( tempfile.gettempdir() + "youthSxMapData.json" )
    if os.path.exists(tmpfile) == False :
        needUpload = True
    elif open(tmpfile).read() != areaMapJson :
        needUpload = True
    else:
        print("no change")
    if needUpload:
        print("upload file")
        # upload
        auth = oss2.Auth(configure.accessKeyId, configure.accessKeySecret)
        bucket = oss2.Bucket(auth, configure.endPoint, configure.bucket)
        bucket.put_object('mapdata.json', areaMapJson)
        # catch
        file_object = open(tmpfile, 'w')
        file_object.write(areaMapJson)
        file_object.close()


def updateIndexData():
    print("update index data")
    andWhere = " and status_remove = 0 "
    sqlArges = []
    cursor = connection.cursor()
    cursor.execute( \
        "select * from (" +\
        "SELECT id," +\
            "(select count(1) +1 from api_item si where si.iwhere = i.iwhere and si.id < i.id) as iwhereid, " +\
            "uid, addtime, status_remove, imgid, iam, itext, iwhere, imghdw, iname, igps, igpswhere "+\
            "FROM api_item i "+\
        ") t "+\
        "where 1 = 1 "+andWhere+\
        "order by id desc", \
        sqlArges)
    results = []
    columns = [column[0] for column in cursor.description]
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))
    from api.views import setIndexData
    setIndexData(results)
    return results

# 设置定时调度
schedule.every(15).minutes.do(updateMapData)
schedule.every(5).minutes.do(updateIndexData)


# 新线程执行的代码:
def scheduleThread():
    logger.info("schedule thread start ...")
    try:
        logger.info("run job first start ...")
        # 首次执行
        updateMapData()
        updateIndexData()
    except Exception as err:
        logger.warning("schedule job run exception >> ", err)
    # 定时调度循环
    while True:
        try:
            schedule.run_pending()
        except Exception as err:
            logger.warning("schedule job run exception >> ", err)
        time.sleep(1)

t = threading.Thread(target=scheduleThread, name='ScheduleThread')
t.start()
