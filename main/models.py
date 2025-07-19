from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Role(models.TextChoices):
    MODERATOR = "mod", "Moderator"
    JURY = "jr", "Jury"
    SPECTATOR = "spec", "Spectator"
    DEFAULT = "def", "Default"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=5, choices=Role.choices, default="def")
    password = models.CharField(max_length=250, null=True, blank=True)

    def __str__(self):
        return self.user.username


class ActionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ipv4 = models.CharField(max_length=50)
    message = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.message} {self.date}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
