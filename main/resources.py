from import_export import resources


class ProfileResource(resources.ModelResource):
    class Meta:
        model = "main.Profile"


class ActionLogResource(resources.ModelResource):
    class Meta:
        model = "main.ActionLog"
