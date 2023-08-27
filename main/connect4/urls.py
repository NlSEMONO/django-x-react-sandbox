from . import views
from django.urls import path

urlpatterns = [
    path('', views.main_game),
    path('get-stats', views.get_stats), 
    path('pdf-file', views.practice_request)
]