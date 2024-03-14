# Generated by Django 4.2.7 on 2024-03-14 06:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_alter_productpackage_printer_design_back_url_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="package",
            name="buyer_address1",
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_city",
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_country_code",
            field=models.CharField(max_length=2, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_email",
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_first_name",
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_last_name",
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_phone",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_province_code",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="buyer_zip",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="linkLabel",
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name="package",
            name="shipment",
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name="productpackage",
            name="note",
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
