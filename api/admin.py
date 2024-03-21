from django.contrib import admin

from api.models import Categories

from .models import (
    Brand,
    BuyedPackage,
    CustomUser,
    CustomUserSendPrint,
    DesignSku,
    DesignSkuChangeHistory,
    FlashShipPODVariantList,
    GroupCustom,
    Image,
    Package,
    Products,
    Shop,
    Templates,
    UserGroup,
    UserShop,
)


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('shop_code', 'shop_name', 'access_token', 'refresh_token', 'auth_code', 'grant_type')
    search_fields = ('shop_code', 'shop_name', 'access_token', 'refresh_token', 'auth_code', 'grant_type')


@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('shop_id', 'data')
    search_fields = ('shop__shop_id', 'data')


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'verify_token')
    search_fields = ('user', 'verify_token')


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('image_data',)
    search_fields = ('image_data',)


@admin.register(Templates)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'category_id', 'description', 'is_cod_open', 'package_height',
                    'package_length', 'package_weight', 'package_width', 'sizes', 'colors', 'type', 'types', 'fixed_images')
    search_fields = ('user', 'name', 'category_id', 'warehouse_id', 'description', 'is_cod_open', 'package_height',
                     'package_length', 'package_weight', 'package_width', 'sizes', 'colors', 'type', 'types', 'fixed_images')


class CategoriesAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình Categories
    list_display = ('id', 'data')  # Thay thế 'id' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'data')  # Thêm các trường bạn muốn tìm kiếm


class UserGroupAdmin(admin.ModelAdmin):
    # Cấu hình hiển thị và tìm kiếm cho mô hình UserGroup
    list_display = ('id', 'user', 'get_group_name', 'role')  # Thay thế 'id', 'user', 'role' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'user__username', 'group_custom__group_name', 'role')  # Thêm các trường bạn muốn tìm kiếm

    def get_group_name(self, obj):
        return obj.group_custom.group_name

    get_group_name.short_description = 'Group Name'


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
    list_display = ('id', 'user', 'get_shop_name')  # Thay thế 'id', 'user' bằng các trường bạn muốn hiển thị
    search_fields = ('id', 'user__username', 'shop__shop_name')  # Thêm các trường bạn muốn tìm kiếm

    def get_shop_name(self, obj):
        return obj.shop.shop_name

    get_shop_name.short_description = 'Shop Name'


class DesignSkuAdmin(admin.ModelAdmin):
    list_display = ('sku_id', 'product_name', 'variation', 'image_front', 'image_back', 'user', 'department')


class DesignSkuChangeHistoryAdmin(admin.ModelAdmin):
    list_display = ('design_sku', 'user', 'changed_at')
    list_filter = ('user', 'changed_at')
    search_fields = ('design_sku__sku', 'user__username')
    readonly_fields = ('design_sku', 'user', 'change_data', 'changed_at')


class FlashShipPODVariantListAdmin(admin.ModelAdmin):
    list_display = ('variant_id', 'color', 'size', 'product_type')
    list_filter = ('product_type',)
    search_fields = ('variant_id', 'color', 'size')


admin.site.register(FlashShipPODVariantList, FlashShipPODVariantListAdmin)
# Đăng ký các lớp admin mới được tạo
admin.site.register(Categories, CategoriesAdmin)
admin.site.register(UserGroup, UserGroupAdmin)
admin.site.register(GroupCustom, GroupCustomAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(UserShop, UserShopAdmin)
admin.site.register(BuyedPackage)
admin.site.register(DesignSku, DesignSkuAdmin)
admin.site.register(DesignSkuChangeHistory, DesignSkuChangeHistoryAdmin)
admin.site.register(Package)
admin.site.register(CustomUserSendPrint)
