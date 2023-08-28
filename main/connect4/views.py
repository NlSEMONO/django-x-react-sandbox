from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Player
import json

# Create your views here.
def main_game(request):
    return render(request, 'index.html')


# CREATING A FUNCTION TO MANAGE DATABASE ACCESS
# https://docs.djangoproject.com/en/4.2/topics/db/queries/
@csrf_exempt
def get_stats(request):
    data = request.body.decode('utf-8') # change string code to utf-8 code, which is how we read stuff normally
    data = json.loads(data) # load json data from what was just parsed to utf-8

    if (request.method == 'POST'): 
        # filter is basically the where command in SQL
        # Player.objects.filter(name='billy') == SELECT * from Player WHERE name='billy'
        # can use get method if there is more than one applicable object
        # .save() is the UPDATE in SQL
        winner = Player.objects.filter(name=f'{data.get("winner")}')[0]
        winner.wins += 1
        winner.save()
        return JsonResponse({'blue': Player.objects.filter(name='blue')[0].wins, 
                             'red': Player.objects.filter(name='red')[0].wins})


@csrf_exempt
def practice_request(request):
    data = request.body.decode('utf-8')
    print(data)
    data = json.loads(data)
    return JsonResponse({'suck my balls': 1})