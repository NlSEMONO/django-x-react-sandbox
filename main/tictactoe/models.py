from django.db import models

# Create your models here.
class TicTacToePlayer(models.Model): 
    name = models.CharField(max_length=32)
    wins = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.name}'