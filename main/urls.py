from django.contrib import admin
from django.urls import include, path

from .views import *

urlpatterns = [
    # Includes
    # Special routes
    path("admin/", admin.site.urls),
    path("v1/", include("challenge_api.urls")),
    path("__devtools__/download-log/", download_log_file, name="download_log_file"),
    path("__devtools__/clear-log/", clear_log_file, name="clear_log_file"),
    path("__devtools__/dump-json-data/", dump_json_data_view, name="get_json_dump"),
    path("__devtools__/dump-sql-data/", dump_sql_data_view, name="get_sql_dump"),
]


