# yourapp/admin.py

from django.contrib import admin
from .models import Shop, CustomUser, Image, Templates, GroupCustom,UserGroup,Brand,UserShop


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

# admin.site.register(Template)

# // register your models here
@admin.register(Templates)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'category_id', 'warehouse_id', 'description', 'is_cod_open', 'package_height', 'package_length', 'package_weight', 'package_width', 'sizes', 'colors', 'type', 'types')
    search_fields = ('user', 'name', 'category_id', 'warehouse_id', 'description', 'is_cod_open', 'package_height', 'package_length', 'package_weight', 'package_width', 'sizes', 'colors', 'type', 'types')

from api.models import Categories
class CategoriesAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình Categories
    list_display = ('id', 'data')  # Thay thế 'id' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'data')  # Thêm các trường bạn muốn tìm kiếm

class UserGroupAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình UserGroup
    list_display = ('id', 'user', 'group_custom', 'role')  # Thay thế 'id', 'user', 'group_custom', 'role' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'user__username', 'group_custom__group_name', 'role')  # Thêm các trường bạn muốn tìm kiếm

class GroupCustomAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình GroupCustom
    list_display = ('id', 'group_name')  # Thay thế 'id', 'group_name' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'group_name')  # Thêm các trường bạn muốn tìm kiếm

class BrandAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình Brand
    list_display = ('id', 'data')  # Thay thế 'id' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'data')  # Thêm các trường bạn muốn tìm kiếm

class UserShopAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình UserShop
    list_display = ('id', 'user', 'shop')  # Thay thế 'id', 'user', 'shop' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'user__username', 'shop__shop_code')  # Thêm các trường bạn muốn tìm kiếm

# Đăng ký các lớp admin mới được tạo
admin.site.register(Categories, CategoriesAdmin)
admin.site.register(UserGroup, UserGroupAdmin)
admin.site.register(GroupCustom, GroupCustomAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(UserShop, UserShopAdmin)