# Generated by Django 4.2.7 on 2024-03-14 06:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0011_alter_productpackage_quantity"),
    ]

    operations = [
        migrations.AddField(
            model_name="package",
            name="fulfillment_name",
            field=models.CharField(max_length=500, null=True),
        ),
    ]