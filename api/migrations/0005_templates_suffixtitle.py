# Generated by Django 4.2.7 on 2024-02-15 04:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_templates_badwords"),
    ]

    operations = [
        migrations.AddField(
            model_name="templates",
            name="suffixTitle",
            field=models.CharField(default="", max_length=500),
        ),
    ]