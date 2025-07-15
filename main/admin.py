from django.contrib import admin

from .models import *


# Remove Unfold Admin
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "id"]
    readonly_fields = ("id",)
    search_fields = ["user"]

