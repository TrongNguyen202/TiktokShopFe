from django.contrib.auth.models import User
from django.db import transaction
from django.forms import model_to_dict
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import filters
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .helpers import send_mail_verification, GenerateSign
from .serializers import (
    SignUpSerializers,
    VerifySerializers,
    ShopSerializers,
    ShopRequestSerializers

)
from api.ultil.tiktokApi import callProductList, getAccessToken, refreshToken, callProductDetail, getCategories, getWareHouseList, callUploadImage, createProduct
from django.http import HttpResponse
from .models import Shop, Image
from api.ultil.constant import app_key, secret, grant_type
from django.http import HttpResponse
from django.http import JsonResponse
import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import requests
import uuid
from PIL import Image
from io import BytesIO
import pandas as pd
import traceback


class SignUp(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=SignUpSerializers,
        responses={
            201: {"description": "Please check your email to verify your account."},
        },
    )
    def post(self, request):
        serializer = SignUpSerializers(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
                new_user = serializer.instance
                send_mail_verification(request, new_user=new_user)
                data = {
                    "message": ("Please check your email to verify your account."),
                    "user": serializer.data,
                }

                return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Verify(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        user_dict = model_to_dict(
            user, ["pk", "username", "email", "first_name", "last_name"]
        )
        data = {
            "pk": uid,
            "verify_token": token,
        }
        serializer = VerifySerializers(user, data=data)
        if serializer.is_valid():
            serializer.save()
            data = {
                "message": (
                    "Thank you for your email confirmation. Now you can login your account."
                ),
                "user": user_dict,
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# render list product by shop


class ListProduct(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)

        response = callProductList(access_token=shop.access_token)
        content = response.content
        print("content", content)
        return HttpResponse(content, content_type='application/json')

# create shop


class Shops(APIView):
    # permission_classes =  (IsAuthenticated,)
    def get_shop_list(self):
        shops = Shop.objects.filter()
        return shops

    @extend_schema(
        request=ShopRequestSerializers,
        responses=ShopSerializers,

    )
    def post(self, request):

        auth_code = request.data.get('auth_code', None)
        shop_name = request.data.get('shop_name', None)
        shop_code = request.data.get('shop_code', None)
        if not auth_code:
            return Response({'error': 'auth_code is required'}, status=status.HTTP_400_BAD_REQUEST)

        respond = getAccessToken(auth_code=auth_code)

        if respond.status_code == 200:
            json_data = respond.json()
            data = json_data.get('data', {})
            access_token = data.get('access_token', None)
            refresh_token = data.get('refresh_token', None)
            print(access_token)
            print(refresh_token)

        else:
            # Handle error, for example:
            return Response({'error': 'Failed to retrieve access_token or refresh_token from the response'}, status=respond.status_code)
        if not access_token or not refresh_token:
            return Response({'error': 'Failed to retrieve access_token or refresh_token from the response'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        shop_data = {
            'auth_code': auth_code,
            "app_key": app_key,
            "app_secret": secret,
            "grant_type": grant_type,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "shop_name": shop_name,
            "shop_code": shop_code
        }

        shopSeri = ShopSerializers(data=shop_data)

        if shopSeri.is_valid():
            shop_code = shop_data.get('shop_code')

    # Check if shop with the given shop_code exists
            if Shop.objects.filter(shop_code=shop_code).exists():
                existing_shop = Shop.objects.get(shop_code=shop_code)

        # Update the existing instance with new access_token and refresh_token
                existing_shop.access_token = access_token
                existing_shop.refresh_token = refresh_token
                existing_shop.save()

                return Response(shopSeri.data, status=status.HTTP_201_CREATED)

    # If shop_code doesn't exist, save a new instance
            shopSeri.save()
            return Response(shopSeri.data, status=status.HTTP_201_CREATED)

        return Response(shopSeri.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=ShopSerializers,
        responses=ShopSerializers,

    )
    # def put(self, request, shop_id):
    #    shop = get_object_or_404(Shop, id=shop_id)
    #    shop_serializer = ShopSerializers(shop, data=request.data)
    #    if shop_serializer.is_valid():
    #        shop_serializer.save()
    #        return Response(shop_serializer.data, status=200)
    #    else:
    #        return Response(shop_serializer.errors, status=400)
    def get(self, request):
        shops = self.get_shop_list()
        serializer = ShopSerializers(shops, many=True)
        return Response(serializer.data)


class ShopDetail(APIView):
    # permission_classes = (IsAuthenticated,)

    def put(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        shop_serializer = ShopSerializers(shop, data=request.data)

        if shop_serializer.is_valid():
            shop_serializer.save()
            return Response(shop_serializer.data, status=200)
        else:
            return Response(shop_serializer.errors, status=400)

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        shop_serializer = ShopSerializers(shop)
        return Response(shop_serializer.data)

    def delete(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)

        try:
            shop.delete()
            return Response({'message': 'Shop deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            # Handle potential exceptions, log them, and return an appropriate response
            return Response({'error': f'Failed to delete shop: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# refresh token
class RefreshToken(APIView):

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        respond = refreshToken(refreshToken=shop.refresh_token)
        access_token = respond.get('data', {}).get('access_token', None)
        shop.access_token = access_token
        shop.save()
        return Response(respond)


class ProductDetail(APIView):

    def get(self, request, shop_id, product_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        response = callProductDetail(
            access_token=access_token, product_id=product_id)
        content = response.content
        return HttpResponse(content, content_type='application/json')


class Categories(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        response = getCategories(access_token=access_token)

        if response.status_code == 200:
            json_data = response.json()
            categories = json_data.get('data', {}).get('category_list', [])

            filtered_categories = [
                category for category in categories if category.get('is_leaf', False)]

            data = {
                'code': 0,
                'data': {
                    'category_list': filtered_categories
                }
            }

            return JsonResponse(data)

        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


class WareHouse(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        response = getWareHouseList(access_token=access_token)
        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


class ShopSearchViews(generics.ListAPIView):
    serializer_class = ShopSerializers

    @extend_schema(
        parameters=[
            OpenApiParameter(name="shop_name", required=False, type=str),
            OpenApiParameter(name="shop_code", required=False, type=str),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)

    def get_queryset(self):
        queryset = Shop.objects.all()

        shop_name = self.request.query_params.get('shop_name', None)
        shop_code = self.request.query_params.get('shop_code', None)

        if shop_name:
            queryset = queryset.filter(shop_name__icontains=shop_name)
        if shop_code:
            queryset = queryset.filter(shop_code__icontains=shop_code)

        return queryset


# @csrf_exempt
# def convert_image_to_base64(request):
#     if request.method == 'POST':
#         # Nhận dữ liệu ảnh từ request
#         image_data = request.POST.get('img_data')

#         # # Tạo một instance của model Image và lưu ảnh
#         # image = Image.objects.create(image_data= image_data )

#         # Chuyển đổi ảnh thành base64
#         image_base64 = base64.b64encode(image_data.read()).decode('utf-8')

#         # Trả về response JSON với ảnh ở định dạng base64
#         response_data = {
#             'image_base64': image_base64,
#         }
#         return JsonResponse(response_data)

#     return JsonResponse({'error': 'Invalid request method'})

class UploadImage(APIView):

    def post(self, request, shop_id):
        # Lấy dữ liệu ảnh từ request.data
        image_data = request.data.get('img_data')
        shop = get_object_or_404(Shop, id=shop_id)
        if image_data:
            try:
                # Chuyển đổi dữ liệu ảnh thành base64
                image_base64 = base64.b64encode(
                    image_data.read()).decode('utf-8')

                # In base64 để kiểm tra (có thể loại bỏ trong production)
                respond = callUploadImage(
                    access_token=shop.access_token, img_data=image_base64)

                # Trả về response JSON với ảnh ở định dạng base64

                return HttpResponse(respond.content, status=status.HTTP_201_CREATED)

            except Exception as e:
                # Xử lý lỗi nếu có
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Trả về lỗi nếu không có dữ liệu ảnh
            return Response({'error': 'No image data provided'}, status=status.HTTP_400_BAD_REQUEST)


class ProcessExcel(APIView):

    def post(self, request, shop_id):
        # Lấy dữ liệu ảnh từ request.data
        excel_file = request.data.get('excel_file')
        shop = get_object_or_404(Shop, id=shop_id)
        if excel_file:
            try:
                df = pd.read_excel(excel_file)
                processed_data = []

                # Filter columns that start with 'image' or are named 'title'
                selected_columns = [col for col in df.columns if col.startswith('image') or col == 'title']
                
                for index, row in df.iterrows():
                    row_data = {col: row[col] for col in selected_columns}
                    processed_data.append(row_data)

                    downloaded_image_paths = []
                    for col, image_url in row_data.items():
                        if col.startswith('image') and not pd.isna(image_url):
                            download_dir = 'C:/anhtiktok'
                            os.makedirs(download_dir, exist_ok=True)
                            random_string = str(uuid.uuid4())[:8]
                            image_filename = os.path.join(download_dir, f"{col}_{index}_{random_string}.jpg")
                            response = requests.get(image_url)
                            if response.status_code == 200:
                                with open(image_filename, 'wb') as f:
                                    f.write(response.content)
                                downloaded_image_paths.append(image_filename)
                        
                    base64_images = []
                    for image_path in downloaded_image_paths:
                        try:
                            # Check bit depth and convert to RGB if needed
                            img = Image.open(image_path)
                            if img.mode != 'RGB' or img.bits != 8:
                                img = img.convert('RGB')
                            img.verify()
                            img.close()

                            with open(image_path, 'rb') as img_file:
                                base64_image = base64.b64encode(img_file.read()).decode('utf-8')
                            base64_images.append(base64_image)

                        except Exception as e:
                            print(f"Error processing image: {image_path}, {str(e)}")
                    
                    images_ids = []
                    # Add your processing logic here using base64_images
                    for img_data in base64_images:
                        img_id = callUploadImage(access_token=shop.access_token, img_data=img_data)
                        images_ids.append(img_id)
                       
                    
                    for item in images_ids:
                        print(item)
                    title = row_data.get('title', '')
                    print(title)
                    
                    createProduct(shop.access_token, request.data.get('category_id'), request.data.get('warehouse_id'), title, images_ids) 
                    
                return JsonResponse({'processed_data': processed_data, 'base64_images': base64_images}, status=status.HTTP_201_CREATED)

            except Exception as e:
               
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
          
            return Response({'error': 'No excel data provided'}, status=status.HTTP_400_BAD_REQUEST)
        




