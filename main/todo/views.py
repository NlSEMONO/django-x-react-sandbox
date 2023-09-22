from django.http import JsonResponse, HttpResponseBadRequest
from typing import Optional
from django.shortcuts import render
from .models import Session, TodoUser, Task
from django.views.decorators.csrf import csrf_exempt
import random
import json

def _generate_hash(num: int):  
    if num > 1000000:
        return str(hash(str(num)))
    else: 
        return _generate_hash(int(str(num) + str(random.randint(0, 9))))

# Create your views here.
def index(request):
    return render(request, 'td-index.html')

@csrf_exempt
def login(request):
    return render(request, 'td-login.html')

@csrf_exempt
def verify_login(request):
    print('success')
    data = request.body.decode('utf-8')
    data = json.loads(data)
    # 1. determine if input is valid
    possible_users = TodoUser.objects.filter(username=data['user'], password=data['pw'])
    if len(possible_users) == 0:
        return JsonResponse({'SS': 'error'})

    # if input is valid, generate a new session id for it
    session = _generate_hash(random.randint(0, 9))
    while len(Session.objects.filter(key=session)) > 0:
        session = _generate_hash(random.randint(0, 9))

    # remove user's previous sessions
    old_sessions = Session.objects.filter(user=possible_users[0])
    old_sessions.delete()

    # put session in database
    s = Session(key=session, user=possible_users[0])
    s.save()
    print(session)

    return JsonResponse({'SS': session})

@csrf_exempt
def verify_signup(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)
    # 1. determine if input is valid (ie. if user is taken)
    possible_users = TodoUser.objects.filter(username=data['user'])
    if len(possible_users) > 0:
        return JsonResponse({'SS': 'error, USERNAME TAKEN'})
    
    # push the new user into the database
    user = TodoUser(username=data['user'], password=data['pw'])
    user.save()

    # let verify_login, which generates the session for you do the rest (can be optimized further)
    return verify_login(request)

def sign_up(request):
    return render(request, 'td-sign-up.html')

@csrf_exempt
def get_tasks(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)

    print(data['SS'])
    print(Session.objects.all())
    session = Session.objects.filter(key=data['SS'])
    if len(session) == 0: 
        return HttpResponseBadRequest(JsonResponse({
            'error': 'An error occured. Please login again.'
        }))
    user = session[0].user
    tasks = {task.name: task.content for task in Task.objects.filter(user=user)}
    print(tasks)
    return JsonResponse({'tasks': tasks})
    
@csrf_exempt
def add_task(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)

    user = Session.objects.filter(key=data['SS'])[0].user
    task = Task(name=data['task'], content=data['content'], user=user)
    task.save()

    return JsonResponse({'tasks': {task.name: task.content for task in Task.objects.filter(user=user)}})

@csrf_exempt
def edit_task(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)

    user = Session.objects.filter(key=data['SS'])[0].user
    task = Task.objects.filter(name=data['task'], content=data['content'], user=user)[0]
    task.name = data['new_task']
    task.content = data['new_content']
    task.save()

    return JsonResponse({'tasks': {task.name: task.content for task in Task.objects.filter(user=user)}})


@csrf_exempt
def remove_task(request):
    data = request.body.decode('utf-8')
    data = json.loads(data)
    user = Session.objects.filter(key=data['SS'])[0].user
    task = Task.objects.filter(name=data['task'], content=data['content'], user=user)[0]
    task.delete()

    return JsonResponse({'tasks': {task.name: task.content for task in Task.objects.filter(user=user)}})