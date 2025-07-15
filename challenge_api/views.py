from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.request import HttpRequest
from rest_framework.response import Response

from main.decorators import login_required
from main.models import Profile

# Create your views here.

@api_view(http_method_names=["GET"])
@login_required()
def get_user_data(request: HttpRequest):
    profile = Profile.objects.get(user=request.user)
    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": profile.role,
        }
    )
