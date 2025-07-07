from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldModelAdmin

from .models import *


# Remove Unfold Admin
@admin.register(Profile)
class ProfileAdmin(UnfoldModelAdmin):
    list_display = ["user", "id", "password", "otp"]
    readonly_fields = ("id",)
    search_fields = ["user", "password", "otp"]

