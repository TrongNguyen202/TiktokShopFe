# Generated by Django 4.2.7 on 2024-03-14 06:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0010_alter_productpackage_variant_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="productpackage",
            name="quantity",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]