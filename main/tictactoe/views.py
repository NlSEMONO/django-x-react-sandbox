from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import TicTacToePlayer
import json
import random

# Create your views here.
def index(request): 
    return render(request, 'ttt-index.html')


GAMES = {}
@csrf_exempt
def move(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)
    id = _generate_gameid() if data['id'] == -1 else data['id']
    if id not in GAMES: 
        GAMES[id] = ['' for _ in range(0, 9)]
    board = GAMES[id]
    board[data['move']] = 'X'
    possible_squares = [i for i in range(0, 9) if board[i] == '']
    winner = _check_winner(board)
    selection = -1
    if (winner == ''): 
        if len(possible_squares) > 0:
            selection = random.choice(possible_squares) 
            board[selection] = 'O'
            winner = _check_winner(board)
        else:
            selection = -2
            
    return JsonResponse({'move': selection, 'winner': winner, 'id': id})


# new-game
@csrf_exempt
def remove_game(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)
    GAMES.pop(data['id'])
    return HttpResponse('Sucessfully removed!')

# get-stats
@csrf_exempt
def get_stats(request): 
    data = request.body.decode('utf-8')
    data = json.loads(data)
    p1 = 'X' if 'p1' not in data else data['p1']
    p2 = 'O' if 'p2' not in data else data['p2']
    possible_p1 = TicTacToePlayer.objects.filter(name=p1)
    possible_p2 = TicTacToePlayer.objects.filter(name=p2)
    p1_data = TicTacToePlayer(name=p1, wins=0) if len(possible_p1) == 0 else possible_p1[0]
    p2_data = TicTacToePlayer(name=p2, wins=0) if len(possible_p2) == 0 else possible_p2[0]
    if (data['winner'] == p1): 
        p1_data.wins += 1
    elif (data['winner'] == p2):
        p2_data.wins += 1
    p1_data.save()
    p2_data.save()

    return JsonResponse({p1: TicTacToePlayer.objects.filter(name=p1)[0].wins,  
                         p2: TicTacToePlayer.objects.filter(name=p2)[0].wins, })

def _check_winner(board): 
    possible_wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6], 
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]
    for seq in possible_wins:
        if board[seq[0]] == board[seq[1]] == board[seq[2]] != '':
            return board[seq[0]]
    return ''

def _generate_gameid():
    number = random.randint(0, 1000000)
    while number in GAMES: 
        number = random.randint(0, 1000000)
    return number