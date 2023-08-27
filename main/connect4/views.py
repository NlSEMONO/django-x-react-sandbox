from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def main_game(request):
    return render(request, 'index.html')


# CREATING A FUNCTION TO MANAGE DATABASE ACCESS
def get_stats(request):
    data = request.body.decode('utf-8') # change string code to utf-8 code, which is how we read stuff normally
    data = json.loads(data) # load json data from what was just parsed to utf-8

@csrf_exempt
def practice_request(request):
    data = request.body.decode('utf-8')
    print(data)
    data = json.loads(data)
    print(data)
    return JsonResponse({'suck my balls': 1})