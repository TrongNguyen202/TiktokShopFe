# Generated by Django 4.2.7 on 2024-04-19 01:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_package_package_status_notification"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="notification",
            options={"ordering": ["-created_at"]},
        ),
        migrations.AddField(
            model_name="notification",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
