# Generated by Django 4.2.7 on 2024-03-14 06:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0009_alter_package_buyer_address1_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="productpackage",
            name="variant_id",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]