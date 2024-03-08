from django.contrib.auth.models import User
from django.db import models
import uuid
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from api.utils import constant


class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verify_token = models.CharField(("Verify token"), max_length=255, null=True)


class GroupCustom(models.Model):
    group_name = models.CharField(null=False, help_text='ten cua phong ban', max_length=500, default='chua co ten')


class UserGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group_custom = models.ForeignKey(GroupCustom, on_delete=models.CASCADE)

    role = models.IntegerField(
        ("Role"),
        choices=constant.ROLE_USERGROUP_CHOICES,
        default=constant.ROLE_USERGROUP_DEFAULT,
    )

    class Meta:
        unique_together = (("user", "group_custom"),)

    def print_attributes(self):
        print(f"User: {self.user}")
        print(f"Group Custom: {self.group_custom}")
        print(f"Role: {self.role}")


class Shop(models.Model):
    shop_code = models.CharField(null=False, help_text='Shop id lấy từ shop code', max_length=500, default='')
    access_token = models.CharField(null=False, max_length=500)
    refresh_token = models.CharField(null=True, max_length=500)
    auth_code = models.CharField(null=False, max_length=500)
    grant_type = models.CharField(default="authorized_code", max_length=500)
    shop_name = models.CharField(max_length=500)
    group_custom_id = models.ForeignKey(GroupCustom, on_delete=models.SET_NULL,  null=True)
    objects = models.Manager()


class Image(models.Model):
    image_data = models.TextField()


class AppKey(models.Model):
    app_key = models.CharField(null=False, help_text='App key lấy từ tiktok app for developer', max_length=500, default='')
    secret = models.CharField(null=False, help_text='App secret lấy từ tiktok app for developer', max_length=500, default='')


class Categories(models.Model):
    data = JSONField()
    objects = models.Manager()


class Brand(models.Model):
    data = JSONField()
    objects = models.Manager()


class UserShop(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)


class Templates(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(null=False, max_length=500, default='')
    category_id = JSONField()
    description = models.TextField(null=False, max_length=50000, default='')
    is_cod_open = models.BooleanField(default=False)
    package_height = models.FloatField(default=1)
    package_length = models.FloatField(default=1)
    package_weight = models.FloatField(default=1)
    package_width = models.FloatField(default=1)
    sizes = ArrayField(models.CharField(20), null=False, default=[])
    colors = ArrayField(models.CharField(20), null=False, default=[])
    type = ArrayField(models.CharField(20), null=False, default=[])
    types = JSONField()
    badWords = ArrayField(models.CharField(200), null=True, default=[])
    suffixTitle = models.CharField(null=True, max_length=500, default='')
    size_chart = models.TextField(null=True)
    fixed_images = ArrayField(models.CharField(20000), null=True, default=[])
    objects = models.Manager()


class Products(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.SET_NULL,  null=True)
    data = models.JSONField()


class BuyedPackage(models.Model):
    package_id = models.CharField(null=False, max_length=500, help_text='Package_id da duoc buy label')


class DesignSku(models.Model):
    sku_id = models.CharField(null=False, max_length=500, help_text='SKU ID')
    product_name = models.CharField(null=False, max_length=500, help_text='product_name')
    variation = models.CharField(null=False, max_length=500, help_text='variation')
    image_front = models.CharField(null=True, max_length=500, help_text='image_front')
    image_back = models.CharField(null=True, max_length=500, help_text='image_back')
    user = models.ForeignKey(User, on_delete=models.SET_NULL,  null=True)
    department = models.ForeignKey(GroupCustom, on_delete=models.SET_NULL,  null=True)


class DesignSkuChangeHistory(models.Model):
    design_sku = models.ForeignKey(DesignSku, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    change_data = models.TextField(null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
