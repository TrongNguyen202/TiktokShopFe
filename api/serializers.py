
from rest_framework import serializers
import datetime
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers, status
from rest_framework.validators import UniqueValidator
from .helpers import check_token, GenerateSign
from .models import Shop, Templates


class SignUpSerializers(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=30,
        label=("Username"),
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
    )
    email = serializers.EmailField(
        max_length=100,
        label=("Email"),
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
    )
    password1 = serializers.CharField(
        max_length=255,
        label=("Password"),
        write_only=True,
        required=True,
        validators=[validate_password],
    )
    password2 = serializers.CharField(
        max_length=255,
        label=("Confirm Password"),
        write_only=True,
        required=True,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password1",
            "password2",
            "first_name",
            "last_name",
        ]

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError(("Password does not match"))

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password1"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            is_active=False,
        )

        return user


class VerifySerializers(serializers.ModelSerializer):
    pk = serializers.IntegerField(label=("User ID"))
    verify_token = serializers.CharField(max_length=255, label=("Verify token"))

    class Meta:
        model = User
        fields = ["pk", "verify_token"]

    def validate(self, data):
        user = User.objects.get(pk=data["pk"])
        if not check_token(user, data["verify_token"]):
            raise serializers.ValidationError(("Activation link is invalid!"))
        return data

    def update(self, instance, validated_data):
        instance.is_active = True
        instance.save()
        return instance


class ShopSerializers(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'


class ShopRequestSerializers(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ["shop_name", "auth_code"]


class TemplateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Templates
    fields = '__all__'

class TemplatePutSerializer(serializers.ModelSerializer):
  class Meta:
    model = Templates
    fields = ['name', 'category_id', 'warehouse_id', 'description', 'is_cod_open', 'package_height', 'package_length', 'package_weight', 'package_width', 'sizes', 'colors', 'type', 'types','badWords','suffixTitle']
