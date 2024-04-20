# Generated by Django 4.2.7 on 2024-04-19 02:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0009_alter_notification_options_notification_created_at_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="NotiMessage",
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
                    "type",
                    models.CharField(max_length=500, verbose_name="type of notification"),
                ),
                ("message", models.TextField(verbose_name="message for notification")),
            ],
        ),
        migrations.AddField(
            model_name="notification",
            name="is_read",
            field=models.BooleanField(default=False, verbose_name="mark as read"),
        ),
        migrations.AlterField(
            model_name="notification",
            name="message",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="notification",
                to="api.notimessage",
            ),
        ),
    ]