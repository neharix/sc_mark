from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import ActionLog, Profile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # request = self.context["request"]
        # service = request.headers.get("X-Service")

        data = super().validate(attrs)

        request = self.context["request"]
        ip = request.META.get(
            "HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "unidentified")
        )
        ActionLog.objects.create(
            message=f'Попытка войти по юзернейму "{attrs["username"]}"', ipv4=ip
        )

        # profile = Profile.objects.get(user=self.user)

        # if profile.allowed_service != service and profile.allowed_service != "both":
        #     raise AuthenticationFailed("No access to this service")

        return data
