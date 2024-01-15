# yourapp/admin.py

from django.contrib import admin
from .models import Shop, CustomUser, Image


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('shop_code', 'shop_name', 'access_token', 'refresh_token', 'auth_code', 'grant_type')
    search_fields = ('shop_code', 'shop_name', 'access_token', 'refresh_token', 'auth_code', 'grant_type')


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'verify_token')
    search_fields = ('user', 'verify_token')


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('image_data',)
    search_fields = ('image_data',)
