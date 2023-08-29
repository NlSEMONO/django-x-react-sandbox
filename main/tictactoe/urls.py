from django.urls import path
from . import views

urlpatterns = [
    path('', views.index), 
    path('player-move', views.move),
    path('get-stats', views.get_stats),
    path('new-game', views.new_game),
]