import io

from constance import config
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

from .serializers import JurySerializer, ProfileSerializer
from .utils import xlsx_exporter, xlsx_importer

# Create your views here.


@api_view(http_method_names=["GET"])
@login_required()
def get_user_data(request: HttpRequest):
    profile = Profile.objects.get(user=request.user)
    configs = {}
    match profile.role:
        case "mod":
            pass
            configs = {
                "can_moderator_add_jury": config.CAN_ADD_JURY,
                "can_see_jury_password": config.CAN_SEE_JURY_PASSWORD,
            }
    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": profile.role,
            "config": configs,
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
            users = User.objects.filter(id__in=user_ids).delete()

    return Response({"detail": "Success"})


@api_view(http_method_names=["POST"])
@login_required(["mod"])
@validate_payload(["model"])
@validate_files(["excel"])
def import_data(request: HttpRequest):
    xlsx_importer(request.data["model"], request.FILES["excel"])
    return Response({"detail": "Success"})


@api_view(http_method_names=["GET", "POST", "PUT", "DELETE"])
@login_required([Role.MODERATOR, Role.SPECTATOR])
def juries_crud(request: HttpRequest, id: int | None = None):
    profile = Profile.objects.get(user=request.user)
    if id:
        match request.method:
            case "GET":
                match profile.role:
                    case Role.MODERATOR:
                        if Profile.objects.filter(id=id, role=Role.JURY).exists():
                            return Response(
                                ProfileSerializer(Profile.objects.get(id=id)).data
                            )
                        else:
                            return Response({"detail": "Not found"}, status=404)
                    case _:
                        return Response({"detail": "Permission denied"}, status=403)
            case "PUT":
                match profile.role:
                    case Role.MODERATOR:
                        if Profile.objects.filter(id=id, role=Role.JURY).exists():
                            profile = Profile.objects.get(id=id)
                            user = profile.user
                        else:
                            return Response({"detail": "Not found"}, status=404)
                        serializer = JurySerializer(
                            user, data=request.data, partial=True
                        )
                        if serializer.is_valid():
                            user.username = serializer.validated_data["username"]
                            user.last_name = serializer.validated_data["last_name"]
                            user.first_name = serializer.validated_data["first_name"]
                            user.email = serializer.validated_data["email"]
                            user.set_password(serializer.validated_data["password"])
                            profile.password = serializer.validated_data["password"]
                            user.save()
                            profile.save()
                            return Response(
                                {"message": "Jury updated successfully"}, status=200
                            )
                        else:
                            return Response({"detail": serializer.errors}, status=400)
                    case _:
                        return Response({"detail": "Permission denied"}, status=403)
            case "DELETE":
                match profile.role:
                    case Role.MODERATOR:
                        if Profile.objects.filter(id=id, role=Role.JURY).exists():
                            user = Profile.objects.get(id=id).user
                            user.delete()
                            return Response({"detail": "Jury deleted successfully"})
                        else:
                            return Response({"detail": "Not found"}, status=404)
                    case _:
                        return Response({"detail": "Permission denied"}, status=403)
    else:
        match request.method:
            case "GET":
                page_size = int(request.GET.get("page_size", 10))
                order = "-" if request.GET.get("order", "asc") == "desc" else ""
                search = request.GET.get("search", False)
                order_key = request.GET.get("column", "username")

                match order_key:
                    case "username":
                        order_key = "user__username"
                    case "last_name":
                        order_key = "user__last_name"
                    case "first_name":
                        order_key = "user__first_name"
                    case "email":
                        order_key = "user__email"

                order_by = order + order_key

                match profile.role:
                    case Role.MODERATOR:
                        if search:
                            queryset = (
                                Profile.objects.filter(
                                    user__username__icontains=search, role=Role.JURY
                                )
                                .exclude(user__id=request.user.id)
                                .select_related("user")
                                .order_by(order_by)
                            )
                        else:
                            queryset = (
                                Profile.objects.filter(role=Role.JURY)
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
                        serializer = ProfileSerializer(paginated_result, many=True)

                        return paginator.get_paginated_response(
                            {
                                "data": serializer.data,
                                "total_pages": paginator.page.paginator.num_pages,
                            }
                        )
                    case _:
                        return Response({"detail": "Permission denied"}, status=403)
            case "POST":
                match profile.role:
                    case Role.MODERATOR:
                        serializer = JurySerializer(data=request.data)
                        if serializer.is_valid():
                            serializer.save()
                            return Response(
                                {"detail": "Jury created successfully"}, status=201
                            )
                        else:
                            print(serializer.errors)
                            return Response({"detail": serializer.errors}, status=400)
                    case _:
                        return Response({"detail": "Permission denied"}, status=403)
