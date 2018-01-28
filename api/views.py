from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.db import connection, transaction
from django.core.paginator import Paginator
from api.configure import configure
import time
import datetime
import random
import json
from api.tasks import updateMapData
from api.tasks import updateIndexData

from api.qcloud_cos.cos_client import CosS3Client, CosConfig
from api.models import Item
from api.service import service as apiService

global indexData
def setIndexData(data):
    global indexData
    indexData = data;


def mapdata(request):
    auth = oss2.Auth(configure.accessKeyId, configure.accessKeySecret)
    bucket = oss2.Bucket(auth, configure.endPoint, configure.bucket)
    remote_stream = bucket.get_object('mapdata.json')
    return HttpResponse(remote_stream.read())

def list(request):
    data = indexData;
    if 'uid' in request.GET:
        data = [val for val in data if val['uid'] == request.GET['uid']]
    elif 'id' in request.GET:
        # ID的查询使用实时查询
        cursor = connection.cursor()
        cursor.execute( \
            "select * from (" +\
            "SELECT id," +\
                "(select count(1) +1 from api_item si where si.iwhere = i.iwhere and si.id < i.id) as iwhereid, " +\
                "uid, addtime, status_remove, imgid, iam, itext, iwhere, imghdw, iname, igps, igpswhere "+\
                "FROM api_item i "+\
            ") t "+\
            "where 1 = 1 and id = %s "+\
            "order by id desc", \
            [request.GET['id']])
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        data = results
    elif 'audit' in request.GET:
        # 带有审核状态的查询使用实时查询
        cursor = connection.cursor()
        cursor.execute( \
            "select * from (" +\
            "SELECT id," +\
                "(select count(1) +1 from api_item si where si.iwhere = i.iwhere and si.id < i.id) as iwhereid, " +\
                "uid, addtime, status_remove, status_audit, imgid, iam, itext, iwhere, imghdw, iname, igps, igpswhere "+\
                "FROM api_item i "+\
            ") t "+\
            "where 1 = 1 and status_audit = %s "+\
            "order by id desc", \
            [request.GET['audit']])
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        data = results
    if 'page' in request.GET:
        return HttpResponse(json.dumps(data[:int(request.GET['page'])], ensure_ascii=False))
    else:
        return HttpResponse(json.dumps(data, ensure_ascii=False))

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

def audit(request):
    Item.objects.filter(id=int(request.GET['id'])).update(status_audit=(int(request.GET['status']) if 'status' in request.GET else 1))
    return HttpResponse('{"status" : "SUCCESS"}')

def upload_token(request):
    config = CosConfig(Region=configure.cosRegion, Secret_id=configure.cosAccessId, Secret_key=configure.cosPrivateKey, Token='')
    client = CosS3Client(config)
    if ('filename' in request.GET):
        fileName = request.GET['filename']
    else:
        fileName = "upload/" + time.strftime("%Y%m%d%H%M%S") + str(random.randint(1000,9999)) + ".jpg"
    token_dict = {
        'uploadUrl' : configure.cosHost + "/" + fileName,
        'authorization' : client.get_auth(
            Method="PUT",
            Bucket=configure.cosBucket,
            Key=fileName,
        )
    }
    result = json.dumps(token_dict)
    # jsonp support
    if ("callback" in request.GET):
        return HttpResponse(request.GET["callback"] + "(" + result + ")")
    else:
        return HttpResponse(result)


def task_exec(request):
    if ("action" in request.GET):
        if (request.GET['action'] == 'updateMapData'):
            updateMapData()
            return HttpResponse("success execute : " + request.GET['action'])
        elif (request.GET['action'] == 'updateIndexData'):
            updateIndexData()
            return HttpResponse("success execute : " + request.GET['action'])
        else:
            return HttpResponse("not found action : " + request.GET['action'])
    else:
        return HttpResponse("not action parmar")
