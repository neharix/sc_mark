from rest_framework import serializers

from main.models import Profile


class ProfileInfoSerializer(serializers.ModelSerializer):
    def get_username(self, instance: Profile):
        return instance.user.username

    username = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("id", "username", "role")
