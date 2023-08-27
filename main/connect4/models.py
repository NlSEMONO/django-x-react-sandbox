from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=128)
    wins = models.IntegerField(default=0)

    def update_wins(self):
        self.wins += 1

    def __str__(self):
        print(f'{self.name}')