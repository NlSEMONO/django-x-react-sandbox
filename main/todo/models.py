from django.db import models
from datetime import datetime, timedelta

# KEY = TOO LAZY TO ENCRYPT, DON'T DO THIS.

class TodoUser(models.Model):
    username = models.CharField(max_length=24, unique=True)
    password = models.CharField(max_length=32)

# Create your models here.
class Session(models.Model): 
    key = models.CharField(max_length=64, unique=True)
    user = models.OneToOneField(
        TodoUser, 
        on_delete=models.CASCADE, 
        primary_key=True
    )
    expiry = models.DateTimeField(default=(datetime.now() + timedelta(weeks=1)))

# class Task(models.Model):
#     name = models.CharField(max_length=128)
#     content = models.CharField(max_length=128)
#     user = models.ForeignKey()

