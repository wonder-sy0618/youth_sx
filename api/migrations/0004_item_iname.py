# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-01-17 13:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_item_imghdw'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='iname',
            field=models.CharField(default='陕西青年', max_length=20),
        ),
    ]
