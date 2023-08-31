from . import views
from django.urls import path

urlpatterns = [
    path('', views.index),
    path('login', views.login), 
    path('sign-up', views.sign_up),
    path('login/verify-login', views.verify_login), 
    path('login/verify-signup', views.verify_signup),
    path('get-tasks', views.get_tasks), 
    path('add-task', views.add_task),
    path('remove-task', views.remove_task)
]