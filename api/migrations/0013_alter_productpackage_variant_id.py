# Generated by Django 4.2.7 on 2024-03-14 06:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0012_package_fulfillment_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="productpackage",
            name="variant_id",
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]