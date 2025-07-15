from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    class Role(models.TextChoices):
        MODERATOR = "mod", "Moderator"
        JURY = "jr", "Jury"
        SPECTATOR = "spec", "Spectator"
        DEFAULT = "def", "Default"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=5, choices=Role.choices, default="def")

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
