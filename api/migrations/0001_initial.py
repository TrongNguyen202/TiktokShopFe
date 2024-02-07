# Generated by Django 4.2.7 on 2024-02-07 02:27

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="AppKey",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "app_key",
                    models.CharField(
                        default="",
                        help_text="Appkey lấy từ tiktok app for developer",
                        max_length=500,
                    ),
                ),
                (
                    "secret",
                    models.CharField(
                        default="",
                        help_text="app secret lấy từ tiktok app for developer",
                        max_length=500,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Brand",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("data", models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name="Categories",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("data", models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name="GroupCustom",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "group_name",
                    models.CharField(
                        default="chua co ten",
                        help_text="ten cua phong ban",
                        max_length=500,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Image",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image_data", models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name="Shop",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "shop_code",
                    models.CharField(
                        default="", help_text="Shop id lấy từ shop code", max_length=500
                    ),
                ),
                ("access_token", models.CharField(max_length=500)),
                ("refresh_token", models.CharField(max_length=500, null=True)),
                ("auth_code", models.CharField(max_length=500)),
                (
                    "grant_type",
                    models.CharField(default="authorized_code", max_length=500),
                ),
                ("shop_name", models.CharField(max_length=500)),
                (
                    "group_custom_id",
                    models.ForeignKey(
                        default=1,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.groupcustom",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserShop",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "shop",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.shop"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Templates",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(default="", max_length=500)),
                ("category_id", models.JSONField()),
                ("warehouse_id", models.CharField(default="", max_length=500)),
                ("description", models.TextField(default="", max_length=500)),
                ("is_cod_open", models.BooleanField(default=False)),
                ("package_height", models.FloatField(default=1)),
                ("package_length", models.FloatField(default=1)),
                ("package_weight", models.FloatField(default=1)),
                ("package_width", models.FloatField(default=1)),
                (
                    "sizes",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(verbose_name=20),
                        default=[],
                        size=None,
                    ),
                ),
                (
                    "colors",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(verbose_name=20),
                        default=[],
                        size=None,
                    ),
                ),
                (
                    "type",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(verbose_name=20),
                        default=[],
                        size=None,
                    ),
                ),
                ("types", models.JSONField()),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="CustomUser",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "verify_token",
                    models.CharField(
                        max_length=255, null=True, verbose_name="Verify token"
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserGroup",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "role",
                    models.IntegerField(
                        choices=[(0, "Admin"), (1, "Manager"), (2, "Seller")],
                        default=2,
                        verbose_name="Role",
                    ),
                ),
                (
                    "group_custom",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.groupcustom",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("user", "group_custom")},
            },
        ),
    ]
