from django.contrib import admin
from django.urls import path

from main.views import CustomTokenObtainPairView, echo

from .views import *

urlpatterns = [
    # Echo routes
    path("", echo),
    # Authentication routes
    path("token/", CustomTokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("me/", get_user_data, name="user-data"),
    # Special routes
    path("home/", home_api_view),
    path("export/", export_data),
    path("delete/", delete_data),
    # User routes
    path("users/", users_list_create),
]
