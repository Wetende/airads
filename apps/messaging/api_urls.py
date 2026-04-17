from django.urls import path

from . import views

app_name = 'messaging_api'

urlpatterns = [
    path('unread-count/', views.api_unread_count, name='unread_count'),
]
