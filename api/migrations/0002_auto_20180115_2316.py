# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-01-15 15:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='uid',
            field=models.CharField(max_length=50),
        ),
    ]
