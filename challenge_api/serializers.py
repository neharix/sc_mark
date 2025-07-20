from django.contrib.auth.models import User
from rest_framework import serializers

from main.models import Profile, Role


class ProfileSerializer(serializers.ModelSerializer):
    def get_username(self, instance: Profile):
        return instance.user.username

    def get_last_name(self, instance: Profile):
        return instance.user.last_name

    def get_first_name(self, instance: Profile):
        return instance.user.first_name

    def get_email(self, instance: Profile):
        return instance.user.email

    username = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("id", "username", "password", "last_name", "first_name", "email")


class JurySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        profile = Profile.objects.get(user=user)
        profile.password = validated_data["password"]
        profile.role = Role.JURY
        profile.save()
        return user
