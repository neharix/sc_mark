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
]