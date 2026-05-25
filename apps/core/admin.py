from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import AdmissionApplication, Program, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    ]
    list_filter = ["is_staff", "is_superuser", "is_active"]
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering = ["username"]

    fieldsets = BaseUserAdmin.fieldsets + (("Additional Info", {"fields": ("phone",)}),)
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Additional Info", {"fields": ("phone",)}),
    )


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "blueprint", "is_published", "created_at"]
    list_filter = ["is_published", "blueprint"]
    search_fields = ["name", "code", "description"]
    ordering = ["-created_at"]
    date_hierarchy = "created_at"


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = [
        "full_name",
        "phone",
        "preferred_campus",
        "preferred_programme",
        "status",
        "created_at",
    ]
    list_filter = ["status", "preferred_campus", "intake"]
    search_fields = ["full_name", "phone", "email", "preferred_programme"]
    ordering = ["-created_at"]
    date_hierarchy = "created_at"
