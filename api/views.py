from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
import json
import datetime
import time
import base64
import hmac
from hashlib import sha1 as sha

from api.models import Item

def list(request):
    if 'uid' in request.GET:
        data = Item.objects.filter(status_remove=0).filter(uid=request.GET["uid"])
    else:
        data = Item.objects.filter(status_remove=0)
    raw_data = serializers.serialize("python", data)
    for item in raw_data:
        item['fields']['id'] = item['pk']
    actual_data = [d['fields'] for d in raw_data]
    return HttpResponse(json.dumps(actual_data, ensure_ascii=False))

def upload(request):
    item = Item( \
        uid=request.POST["uid"], \
        addtime=datetime.datetime.now().strftime("%Y%m%d%H%M%S"), \
        status_remove=0, \
        imgid=request.POST["imgid"], \
        imghdw=request.POST["imghdw"],  \
        itext=request.POST["itext"], \
        iam=request.POST["iam"], \
        iwhere=request.POST["iwhere"] \
        )
    item.save()
    return HttpResponse(serializers.serialize('json', [item,]))


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
