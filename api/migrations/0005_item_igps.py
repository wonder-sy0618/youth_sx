# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-01-18 16:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_item_iname'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='igps',
            field=models.CharField(default='', max_length=50),
        ),
    ]
