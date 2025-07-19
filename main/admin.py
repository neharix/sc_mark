from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import *


@admin.register(Profile)
class ProfileAdmin(ImportExportModelAdmin):
    list_display = ("user", "id")
    readonly_fields = ("id",)
    search_fields = ("user",)


@admin.register(ActionLog)
class ActionLogAdmin(ImportExportModelAdmin):
    list_display = ("user", "ipv4", "date", "id")
    search_fields = ("user", "ipv4")
    readonly_fields = ("id", "ipv4", "user", "message", "date")
    list_filter = ("user", "ipv4", "date")
