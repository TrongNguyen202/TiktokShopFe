from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .helpers import check_token
from .models import (
    BuyedPackage,
    DesignSku,
    FlashShipPODVariantList,
    GroupCustom,
    Notification,
    NotiMessage,
    Package,
    ProductPackage,
    Shop,
    TemplateDesign,
    Templates,
    Image,
    ImageFolder
)


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
        fields = "__all__"


class ShopRequestSerializers(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ["shop_name", "auth_code"]


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Templates
        fields = "__all__"


class TemplatePutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Templates
        fields = [
            "name",
            "category_id",
            "description",
            "is_cod_open",
            "package_height",
            "package_length",
            "package_weight",
            "package_width",
            "sizes",
            "colors",
            "type",
            "types",
            "badWords",
            "suffixTitle",
            "size_chart",
            "fixed_images",
        ]


class BuyedPackageSeri(serializers.ModelSerializer):
    class Meta:
        model = BuyedPackage
        fields = "__all__"


class DesignSkuSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignSku
        fields = "__all__"


class DesignSkuPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignSku
        fields = ["image_front", "image_back"]
        extra_kwargs = {
            "image_front": {"required": False},
            "image_back": {"required": False},
        }


class GroupCustomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupCustom
        fields = ["id", "group_name"]


class FlashShipPODVariantListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashShipPODVariantList
        fields = ["variant_id", "color", "size", "product_type"]


class ProductPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPackage
        fields = ["quantity", "variant_id", "note", "printer_design_front_url", "printer_design_back_url"]
        extra_kwargs = {
            "printer_design_front_url": {"allow_blank": True, "required": False},
            "printer_design_back_url": {"allow_blank": True, "required": False},
        }


class PackageSerializer(serializers.ModelSerializer):
    products = ProductPackageSerializer(many=True)

    class Meta:
        model = Package
        fields = [
            "order_id",
            "buyer_first_name",
            "buyer_last_name",
            "buyer_email",
            "buyer_phone",
            "buyer_address1",
            "buyer_address2",
            "buyer_city",
            "buyer_province_code",
            "buyer_zip",
            "buyer_country_code",
            "shipment",
            "linkLabel",
            "products",
            "fulfillment_name",
            "shop",
            "order_code",
            "pack_id",
            "package_status",
        ]

    def create(self, validated_data):
        products_data = validated_data.pop("products")
        package = Package.objects.create(**validated_data)
        for product_data in products_data:
            ProductPackage.objects.create(package=package, **product_data)
        return package


class PackageDeactiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ["package_status"]


class TemplateDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateDesign
        fields = "__all__"


class NotiMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotiMessage
        fields = ("id", "type", "message")


class NotificationSerializer(serializers.ModelSerializer):
    message = NotiMessageSerializer()
    shop = serializers.SerializerMethodField()

    # Lấy tên người dùng từ mô hình người dùng Django
    user = serializers.SerializerMethodField()

    def get_shop(self, obj):
        return obj.id

    def get_user(self, obj):
        return obj.user.username  # Lấy username từ user object

    class Meta:
        model = Notification
        fields = ("id", "user", "shop", "message", "created_at", "is_read")


class NotiPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "is_read"


class NestedImageFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageFolder
        fields = '__all__'


class ImageFolderSerializer(serializers.ModelSerializer):
    children = NestedImageFolderSerializer(many=True, read_only=True)

    class Meta:
        model = ImageFolder
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
