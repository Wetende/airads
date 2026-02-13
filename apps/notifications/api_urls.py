"""
Notification API URL patterns.
"""

from django.urls import path
from . import views

app_name = "notifications_api"

urlpatterns = [
    path("", views.api_list_notifications, name="list"),
    path("preferences/", views.api_preferences, name="preferences"),
    path("unread-count/", views.api_unread_count, name="unread_count"),
    path("mark-all-read/", views.api_mark_all_read, name="mark_all_read"),
    path("<int:pk>/read/", views.api_mark_read, name="read"),
    path("<int:pk>/", views.api_delete_notification, name="delete"),
]
