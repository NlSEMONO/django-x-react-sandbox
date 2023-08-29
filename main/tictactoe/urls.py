from django.urls import path
from . import views

urlpatterns = [
    path('', views.index), 
    path('player-move', views.move),
]