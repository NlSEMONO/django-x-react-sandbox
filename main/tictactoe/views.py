from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import random

# Create your views here.
def index(request): 
    return render(request, 'ttt-index.html')

board = ['' for i in range(0, 9)]
@csrf_exempt
def move(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)
    print(data['move'])
    board[data['move']] = 'X'
    possible_squares = [i for i in range(0, 9) if board[i] == '']
    if len(possible_squares) > 0:
        selection = random.choice(possible_squares) 
        board[selection] = 'O'
    else: 
        selection = -1
    print(board)
    return JsonResponse({'move': selection, 'winner': ''})