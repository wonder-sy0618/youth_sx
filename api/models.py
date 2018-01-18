from django.db import models

# Create your models here.
class Item(models.Model):
    id = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=50)
    addtime = models.CharField(max_length=14)
    status_remove = models.IntegerField()
    imgid = models.CharField(max_length=20)
    imghdw = models.FloatField(default=1)
    iname = models.CharField(max_length=20, default="陕西青年")
    iam = models.CharField(max_length=20, default="陕西青年")
    itext = models.CharField(max_length=50, default="")
    iwhere = models.CharField(max_length=50, default="陕西省,,")
    igps = models.CharField(max_length=50, default="")
