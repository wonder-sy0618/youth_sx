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
        imgid=("imgid" in request.POST ? request.POST["imgid"] : ""), \
        iname=("iname" in request.POST ? request.POST["iname"] : ""), \
        imghdw=("imghdw" in request.POST ? request.POST["imghdw"] : 1),  \
        itext=("itext" in request.POST ? request.POST["itext"] : ""), \
        iam=("iam" in request.POST ? request.POST["iam"] : ""), \
        igps=("igps" in request.POST ? request.POST["igps"] : ""), \
        igpswhere=("igpswhere" in request.POST ? request.POST["igpswhere"] : "陕西省"), \
        iwhere=("iwhere" in request.POST ? request.POST["iwhere"] : "") \
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
