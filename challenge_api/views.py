import io

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.request import HttpRequest
from rest_framework.response import Response

from main.decorators import login_required, validate_files, validate_payload
from main.models import ActionLog, Profile, Role
from main.paginators import ResponsivePageSizePagination

from .serializers import ProfileInfoSerializer
from .utils import xlsx_exporter, xlsx_importer

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


@api_view(http_method_names=["GET"])
@login_required()
def home_api_view(request: HttpRequest):
    profile = Profile.objects.get(user=request.user)
    match profile.role:
        case "mod":
            return Response(
                {
                    "projects": 10,
                    "rated_projects": 3,
                    "unrated_projects": 7,
                    "juries": Profile.objects.filter(role=Role.JURY).count(),
                    "spectators": Profile.objects.filter(role=Role.SPECTATOR).count(),
                }
            )
        case _:
            return Response({"detail": "Unknown role"}, status=403)


@api_view(http_method_names=["POST"])
@login_required(["mod"])
@validate_payload(["model", "identificators"])
def export_data(request: HttpRequest):
    workbook = xlsx_exporter(request.data["model"], request.data["identificators"])

    with io.BytesIO() as buffer:
        workbook.save(buffer)
        content = buffer.getvalue()

    response = HttpResponse(
        content=content,
        content_type="application/xlsx",
    )
    filename = f"{request.data['model']}-{timezone.now().strftime('%d-%m-%Y')}.xlsx"
    response["Content-Disposition"] = f'attachment; filename="' + filename + '"'
    return response


@api_view(http_method_names=["POST"])
@login_required(["mod"])
@validate_payload(["model", "identificators"])
def delete_data(request: HttpRequest):
    metas = []
    match request.data["model"]:
        case "profile":
            data = Profile.objects.filter(id__in=request.data["identificators"])
            user_ids = [item.user.id for item in data]
            users = User.objects.filter(id__in=user_ids)
            metas.append(users)

    data.delete()

    while len(metas) > 0:
        metas[len(metas) - 1].delete()

    return Response({"detail": "Success"})


@api_view(http_method_names=["POST"])
@login_required(["mod"])
@validate_payload(["model"])
@validate_files(["excel"])
def import_data(request: HttpRequest):
    xlsx_importer(request.data["model"], request.FILES["excel"])
    return Response({"detail": "Success"})


@api_view(http_method_names=["GET", "POST"])
@login_required([Role.MODERATOR, Role.SPECTATOR])
def users_list_create(request: HttpRequest):
    profile = Profile.objects.get(user=request.user)

    match request.method:
        case "GET":
            page_size = int(request.GET.get("page_size", 10))
            order = "-" if request.GET.get("order", "asc") == "desc" else ""
            search = request.GET.get("search", False)
            order_key = request.GET.get("column", "username")

            match order_key:
                case "username":
                    order_key = "user__username"

            order_by = order + order_key

            match profile.role:
                case Role.MODERATOR:
                    if search:
                        queryset = (
                            Profile.objects.filter(user__username__icontains=search)
                            .exclude(user__id=request.user.id)
                            .select_related("user")
                            .order_by(order_by)
                        )
                    else:
                        queryset = (
                            Profile.objects.all()
                            .exclude(user__id=request.user.id)
                            .select_related("user")
                            .order_by(order_by)
                        )
                    paginator = ResponsivePageSizePagination()
                    paginator.page_size = page_size
                    try:
                        paginated_result = paginator.paginate_queryset(
                            queryset, request
                        )
                    except NotFound:
                        request._request.GET._mutable = True
                        request._request.GET["page"] = 1
                        request._request.GET._mutable = False
                        paginated_result = paginator.paginate_queryset(
                            queryset, request
                        )
                    serializer = ProfileInfoSerializer(paginated_result, many=True)

                    return paginator.get_paginated_response(
                        {
                            "data": serializer.data,
                            "total_pages": paginator.page.paginator.num_pages,
                        }
                    )
