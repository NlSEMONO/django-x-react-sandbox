# Generated by Django 4.2.4 on 2023-08-31 15:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_alter_session_expiry_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 7, 15, 14, 0, 826792)),
        ),
    ]