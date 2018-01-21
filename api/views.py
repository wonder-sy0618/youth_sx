from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.db import connection, transaction
from django.core.paginator import Paginator
import json
import datetime
import time
import base64
import hmac
from hashlib import sha1 as sha

from api.models import Item

defLocalGPS = {
    '陕西省,西安市' : [108.9538527927,34.3469507423],
    '陕西省,铜川市' : [108.9515311037,34.9030407400],
    '陕西省,宝鸡市' : [107.2438442824,34.3678424177],
    '陕西省,咸阳市' : [108.7157001898,34.3356398252],
    '陕西省,渭南市' : [109.5167465261,34.5056530314],
    '陕西省,汉中市' : [107.0301902437,33.0738288757],
    '陕西省,安康市' : [109.0359067046,32.6906350671],
    '陕西省,商洛市' : [109.9468933267,33.8764464205],
    '陕西省,延安市' : [109.4963424332,36.5910460325],
    '陕西省,榆林市' : [109.7411742617,38.2909664764]
}

def mapdata(request):
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
            if (defLocalKey in defLocalGPS):
                areaMap[igpswhere].extend([defLocalGPS[defLocalKey]])
    return HttpResponse(json.dumps({'areas' : areaMap}, ensure_ascii=False))

def list(request):
    andWhere = " and status_remove = 0 "
    sqlArges = []
    if 'uid' in request.GET:
        andWhere = andWhere + " and uid = %s "
        sqlArges.append(request.GET["uid"])
    elif 'id' in request.GET:
        andWhere = andWhere + " and id = %s "
        sqlArges.append(request.GET["id"])
    else:
        if 'lastid' in request.GET:
            andWhere = andWhere + " and id < %s "
            sqlArges.append(request.GET["lastid"])
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
    if 'page' in request.GET:
        return HttpResponse(json.dumps(results[:int(request.GET['page'])], ensure_ascii=False))
    else:
        return HttpResponse(json.dumps(results, ensure_ascii=False))

def upload(request):
    item = Item( \
        uid=request.POST["uid"], \
        addtime=datetime.datetime.now().strftime("%Y%m%d%H%M%S"), \
        status_remove=0, \
        imgid=(request.POST["imgid"] if "imgid" in request.POST else "" ), \
        iname=(request.POST["iname"] if "iname" in request.POST else "" ), \
        imghdw=(request.POST["imghdw"] if "imghdw" in request.POST else 1 ), \
        itext=(request.POST["itext"] if "itext" in request.POST else "" ), \
        iam=(request.POST["iam"] if "iam" in request.POST else "" ), \
        igps=(request.POST["igps"] if "igps" in request.POST else "" ), \
        igpswhere=(request.POST["igpswhere"] if "igpswhere" in request.POST else "陕西省" ), \
        iwhere=(request.POST["iwhere"] if "iwhere" in request.POST else "" ) \
        )
    item.save()
    return HttpResponse(serializers.serialize('json', [item,]))

def delete(request):
    Item.objects.filter(id=int(request.GET['id'])).filter(uid=request.GET['uid']).update(status_remove=1)
    return HttpResponse('{"status" : "SUCCESS"}')

def get_iso_8601(expire):
    gmt = datetime.datetime.fromtimestamp(expire).isoformat()
    gmt += 'Z'
    return gmt


def upload_token(request):

    accessKeyId = 'LTAIYHvPO8sqr1Ud'
    accessKeySecret = 'V80aGhmoAgjZcISiZFt9LScnBlTs8u'
    host = 'http://testactive.oss-cn-beijing.aliyuncs.com';
    expire_time = 30
    upload_dir = 'upload/'

    now = int(time.time())
    expire_syncpoint  = now + expire_time
    expire = get_iso_8601(expire_syncpoint)

    policy_dict = {}
    policy_dict['expiration'] = expire
    condition_array = []
    array_item = []
    array_item.append('starts-with');
    array_item.append('$key');
    array_item.append(upload_dir);
    condition_array.append(array_item)
    policy_dict['conditions'] = condition_array
    policy = json.dumps(policy_dict).strip()
    #policy_encode = base64.encodestring(policy)
    policy_encode = base64.b64encode(policy.encode(encoding="UTF-8"))
    print(policy_encode)
    h = hmac.new(accessKeySecret.encode(encoding="UTF-8"), policy_encode, sha)
    sign_result = base64.encodestring(h.digest()).strip()

    token_dict = {}
    token_dict['accessid'] = accessKeyId
    token_dict['host'] = host
    token_dict['policy'] = policy_encode.decode(encoding="UTF-8")
    token_dict['signature'] = sign_result.decode(encoding="UTF-8")
    token_dict['expire'] = expire_syncpoint
    token_dict['dir'] = upload_dir
    result = json.dumps(token_dict)
    # jsonp
    if (request.GET["callback"]):
        return HttpResponse(request.GET["callback"] + "(" + result + ")")
    else:
        return HttpResponse(result)
