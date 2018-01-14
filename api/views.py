from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
import json
import datetime

from api.models import Item


def list(request):
    if 'uid' in request.GET:
        data = Item.objects.filter(status_remove=0).filter(uid=request.GET["uid"])
    else:
        data = Item.objects.filter(status_remove=0)
    raw_data = serializers.serialize("python", data)
    actual_data = [d['fields'] for d in raw_data]
    return HttpResponse(json.dumps(actual_data, ensure_ascii=False))

def upload(request):
    item = Item( \
        uid=request.POST["uid"], \
        addtime=datetime.datetime.now().strftime("%Y%m%d%H%M%S"), \
        status_remove=0, \
        imgid=request.POST["imgid"], \
        utext=request.POST["utext"] \
        )
    item.save()
    return HttpResponse(serializers.serialize('json', [item,]))
