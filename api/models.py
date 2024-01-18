from django.contrib.auth.models import User
from django.db import models
import uuid
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField


class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verify_token = models.CharField(("Verify token"), max_length=255, null=True)


class Shop(models.Model):
    shop_code = models.CharField(null=False, help_text='Shop id lấy từ shop code', max_length=500, default='')
    access_token = models.CharField(null=False, max_length=500)
    refresh_token = models.CharField(null=True, max_length=500)
    auth_code = models.CharField(null=False, max_length=500)
    grant_type = models.CharField(default="authorized_code", max_length=500)
    shop_name = models.CharField(max_length=500)

    objects = models.Manager()


class Image(models.Model):

    image_data = models.TextField()


class AppKey(models.Model):
    app_key = models.CharField(null=False, help_text='Appkey lấy từ tiktok app for developer',
                               max_length=500, default='')
    secret = models.CharField(null=False, help_text='app secret lấy từ tiktok app for developer',
                              max_length=500, default='')

class Template(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(null=False, max_length=500,default='' )
    category_id = models.CharField(null=False, max_length=500,default='')
    warehouse_id = models.CharField(null=False, max_length=500,default='')
    description = models.TextField(null=False, max_length=500,default='')
    is_cod_open = models.BooleanField(default=False)
    package_height = models.FloatField(default=1)
    package_length = models.FloatField(default=1)
    package_weight = models.FloatField(default=1)
    package_width = models.FloatField(default=1)
    sizes = ArrayField(models.CharField(20), null=False, default=[])
    colors = ArrayField(models.CharField(20), null=False, default=[])
    type = ArrayField(models.CharField(20), null=False, default=[])
    types = JSONField()

    objects = models.Manager()

class Categories(models.Model):
    data = JSONField()
    objects = models.Manager()
