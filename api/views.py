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
from .helpers import send_mail_verification, GenerateSign,is_webp_image_without_bits
from .serializers import (
    SignUpSerializers,
    VerifySerializers,
    ShopSerializers,
    ShopRequestSerializers

)
from api.ultil.tiktokApi import callProductList, getAccessToken, refreshToken, callProductDetail, getCategories, getWareHouseList, callUploadImage, createProduct,getBrands,callEditProduct  
from django.http import HttpResponse
from .models import Shop, Image
from api.ultil.constant import app_key, secret, grant_type,ProductObject,ProductCreateObject
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
from concurrent.futures import ThreadPoolExecutor
from django.views import View
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
import pandas as pd
import os
import base64
import uuid
from PIL import Image
import requests
import traceback
from rest_framework import status
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import os
import base64
import uuid
import requests
import traceback
from concurrent.futures import ThreadPoolExecutor
from django.views import View
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from PIL import Image



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
        json_data = respond.json()
        data = json_data.get('data', {})
        access_token = data.get('access_token', None)
        refresh_token = data.get('refresh_token', None)  # Fix the typo here
        print(access_token)
        print(refresh_token)
        shop.access_token = access_token
        shop.refresh_token = refresh_token
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

            # filtered_categories = [
            #     category for category in categories if category.get('is_leaf', False)]

            data = {
                'code': 0,
                'data': {
                    'category_list': categories
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

@method_decorator(csrf_exempt, name='dispatch')
class ProcessExcelNo(APIView):

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
                            if is_webp_image_without_bits(img=img):
                               os.remove(image_path)
                               print(f"Đã xóa ảnh: {image_path}")
                               continue
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
        

class GetAllBrands(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        response = getBrands(access_token=shop.access_token)
        content = response.content
        
        return HttpResponse(content, content_type='application/json')



class CategoriesIsleaf(APIView):

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




@method_decorator(csrf_exempt, name='dispatch')
class MultithreadProcessExcel(View):

    def post(self, request, shop_id):
        try:
            excel_file = request.FILES.get('excel_file')
            shop = get_object_or_404(Shop, id=shop_id)

            if not excel_file:
                return Response({'error': 'No excel data provided'}, status=status.HTTP_400_BAD_REQUEST)

            df = pd.read_excel(excel_file)
            processed_data = []

            selected_columns = [col for col in df.columns if col.startswith('image') or col == 'title']

            with ThreadPoolExecutor() as executor:
                futures = []
                for index, row in df.iterrows():
                    row_data = {col: row[col] for col in selected_columns}
                    processed_data.append(row_data)

                    category_id = request.POST.get('category_id')
                    warehouse_id = request.POST.get('warehouse_id')

                    futures.append(executor.submit(self.process_row_data, row_data, shop, category_id, warehouse_id))

                for future in futures:
                    future.result()

            return JsonResponse({'processed_data': processed_data}, status=status.HTTP_201_CREATED)

        except ObjectDoesNotExist as e:
            return HttpResponse({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(traceback.format_exc())
            return HttpResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def process_row_data(self, row_data, shop, category_id, warehouse_id):
        downloaded_image_paths = []
        futures = []

  
        with ThreadPoolExecutor() as executor:
            for col, image_url in row_data.items():
                if col.startswith('image') and not pd.isna(image_url):
                    futures.append(executor.submit(self.download_image, image_url, col, shop))


            for future in futures:
                downloaded_image_paths.append(future.result())

        base64_images = self.process_images(downloaded_image_paths)
        images_ids = self.upload_images(base64_images, shop)
        self.create_product(shop, category_id, warehouse_id, row_data, images_ids)

    def download_image(self, image_url, col, shop):
        download_dir = 'C:/anhtiktok'
        os.makedirs(download_dir, exist_ok=True)
        random_string = str(uuid.uuid4())[:8]
        image_filename = os.path.join(download_dir, f"{col}_{random_string}.jpg")
        response = requests.get(image_url)
        if response.status_code == 200:
            with open(image_filename, 'wb') as f:
                f.write(response.content)
        return image_filename

    def process_images(self, downloaded_image_paths):
        base64_images = []
        for image_path in downloaded_image_paths:
            try:
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

        return base64_images

    def upload_images(self, base64_images, shop):
        images_ids = []
        for img_data in base64_images:
            img_id = callUploadImage(access_token=shop.access_token, img_data=img_data)
            images_ids.append(img_id)
        return images_ids

    def create_product(self, shop, category_id, warehouse_id, row_data, images_ids):
        for item in images_ids:
            print(item)
        title = row_data.get('title', '')
        print(title)

        createProduct(shop.access_token, category_id, warehouse_id, title, images_ids)

# import json
# import os
# import base64
# import uuid
# import requests
# import traceback
# from concurrent.futures import ThreadPoolExecutor
# from django.views import View
# from django.shortcuts import get_object_or_404
# from django.http import JsonResponse, HttpResponse
# from django.core.exceptions import ObjectDoesNotExist
# from rest_framework import status
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from PIL import Image
# from .models import Shop

# @method_decorator(csrf_exempt, name='dispatch')
# class ProcessExcel(View):

#     def post(self, request, shop_id):
#         try:
#             # Check if request.body is not empty
#             if not request.body:
#                 return JsonResponse({'error': 'Empty request body'}, status=status.HTTP_400_BAD_REQUEST)

#             # Decode request body using 'utf-8'
#             body_str = request.body.decode('utf-8')

#             # Try loading JSON data from the body
#             try:
#                 data = json.loads(body_str)
#                 excel_data = data.get('excel', [])
#                 category_id = data.get('category_id')
#                 warehouse_id = data.get('warehouse_id')
#             except json.JSONDecodeError as json_error:
#                 return JsonResponse({'error': f'Invalid JSON format in request body: {json_error}'}, status=status.HTTP_400_BAD_REQUEST)

#             shop = get_object_or_404(Shop, id=shop_id)

#             processed_data = []

#             with ThreadPoolExecutor() as executor:
#                 futures = []
#                 for item in excel_data:
#                     row_data = {
#                         'title': item.get('title', ''),
#                         'images': item.get('images', {}),
#                     }
#                     processed_data.append(row_data)

#                     futures.append(executor.submit(self.process_item, item, shop, category_id, warehouse_id))

#                 for future in futures:
#                     future.result()

#             return JsonResponse({'processed_data': processed_data}, status=status.HTTP_201_CREATED)

#         except ObjectDoesNotExist as e:
#             return HttpResponse({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             print(traceback.format_exc())
#             return HttpResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     def process_item(self, item, shop, category_id, warehouse_id):
#         title = item.get('title', '')
#         images = item.get('images', {})

#         downloaded_image_paths = []

#         with ThreadPoolExecutor() as executor:
#             image_futures = []

#             for key, image_url in images.items():
#                 image_futures.append(executor.submit(self.download_image, image_url, key, shop))

#             for future in image_futures:
#                 downloaded_image_paths.append(future.result())

#         base64_images = self.process_images(downloaded_image_paths)
#         images_ids = self.upload_images(base64_images, shop)
#         self.create_product(shop, category_id, warehouse_id, item, images_ids)

#     def download_image(self, image_url, key, shop):
#         if image_url:
#             download_dir = 'C:/anhtiktok'  # Đường dẫn lưu trữ hình ảnh
#             os.makedirs(download_dir, exist_ok=True)
#             random_string = str(uuid.uuid4())[:8]
#             image_filename = os.path.join(download_dir, f"{key}_{random_string}.jpg")
#             response = requests.get(image_url)

#             if response.status_code == 200:
#                 with open(image_filename, 'wb') as f:
#                     f.write(response.content)
#                 return image_filename

#     def process_images(self, downloaded_image_paths):
#         base64_images = []
#         for image_path in downloaded_image_paths:
#             try:
#                 img = Image.open(image_path)
#                 if img.mode != 'RGB' or img.bits != 8:
#                     img = img.convert('RGB')
#                 img.verify()
#                 img.close()

#                 with open(image_path, 'rb') as img_file:
#                     base64_image = base64.b64encode(img_file.read()).decode('utf-8')
#                 base64_images.append(base64_image)

#             except Exception as e:
#                 print(f"Error processing image: {image_path}, {str(e)}")

#         return base64_images

#     def upload_images(self, base64_images, shop):
#         images_ids = []
#         for img_data in base64_images:
#             img_id = callUploadImage(access_token=shop.access_token, img_data=img_data)
#             images_ids.append(img_id)

#         return images_ids

#     def create_product(self, shop, category_id, warehouse_id, row_data, images_ids):
#         for item in images_ids:
#             print(item)
#         title = row_data.get('title', '')
#         print(title)

#         createProduct(shop.access_token, category_id, warehouse_id, title, images_ids)


import json
import os
import base64
import uuid
import requests
import traceback
from concurrent.futures import ThreadPoolExecutor
from django.views import View
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from PIL import Image
from PIL import UnidentifiedImageError

# @method_decorator(csrf_exempt, name='dispatch')
# class ProcessExcel(View):

#     def post(self, request, shop_id):
#         try:
#             # Check if request.body is not empty
#             if not request.body:
#                 return JsonResponse({'error': 'Empty request body'}, status=status.HTTP_400_BAD_REQUEST)

#             # Decode request body using 'utf-8'
#             body_str = request.body.decode('utf-8')

#             # Try loading JSON data from the body
#             try:
#                 data = json.loads(body_str)
#                 excel_data = data.get('excel', [])
#                 category_id = data.get('category_id')
#                 warehouse_id = data.get('warehouse_id')
#             except json.JSONDecodeError as json_error:
#                 return JsonResponse({'error': f'Invalid JSON format in request body: {json_error}'}, status=status.HTTP_400_BAD_REQUEST)

#             shop = get_object_or_404(Shop, id=shop_id)

#             processed_data = []

#             with ThreadPoolExecutor() as executor:
#                 futures = []
#                 for item in excel_data:
#                     row_data = {
#                         'title': item.get('title', ''),
#                         'images': item.get('images', {}),
#                     }
#                     processed_data.append(row_data)

#                     futures.append(executor.submit(self.process_item, item, shop, category_id, warehouse_id))

#                 for future in futures:
#                     future.result()

#             return JsonResponse({'processed_data': processed_data}, status=status.HTTP_201_CREATED)

#         except ObjectDoesNotExist as e:
#             return HttpResponse({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             print(traceback.format_exc())
#             return HttpResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     def process_item(self, item, shop, category_id, warehouse_id):
#         title = item.get('title', '')
#         images = item.get('images', {})

#         downloaded_image_paths = []

#         with ThreadPoolExecutor() as executor:
#             image_futures = []

#             for key, image_url in images.items():
#                 image_futures.append(executor.submit(self.download_image, image_url, key, shop))

#             for future in image_futures:
#                 result = future.result()
#                 if result:
#                     downloaded_image_paths.append(result)

#         base64_images = self.process_images(downloaded_image_paths)
#         images_ids = self.upload_images(base64_images, shop)
#         self.create_product(shop, category_id, warehouse_id, item, images_ids)

#     def download_image(self, image_url, key, shop):
#         if image_url:
#             download_dir = 'C:/anhtiktok'  # Đường dẫn lưu trữ hình ảnh
#             os.makedirs(download_dir, exist_ok=True)
#             random_string = str(uuid.uuid4())[:8]
#             image_filename = os.path.join(download_dir, f"{key}_{random_string}.jpg")
#             response = requests.get(image_url)

#             if response.status_code == 200:
#                 with open(image_filename, 'wb') as f:
#                     f.write(response.content)
#                 return image_filename

#     def process_images(self, downloaded_image_paths):
#         base64_images = []
#         for image_path in downloaded_image_paths:
#             try:
#                 img = Image.open(image_path)
#             except UnidentifiedImageError as e:
#                 if e.args[0] == 'WebP':
                   
#                     with open(image_path, 'rb') as img_file:
#                         base64_image = base64.b64encode(img_file.read()).decode('utf-8')
#                         base64_images.append(base64_image)
#                     continue
#                 else:
#                     raise

#             try:
#                 if img.mode != 'RGB':
#                     img = img.convert('RGB')
#                 if img.mode == 'RGBA':
#                      img = img.convert('RGB')

#                 with open(image_path, 'rb') as img_file:
#                     base64_image = base64.b64encode(img_file.read()).decode('utf-8')
#                     base64_images.append(base64_image)
#             except Exception as e:
#                 print(f"Error processing image: {image_path}, {str(e)}")
#         print("countttttttttttttt", len(base64_images))
#         return base64_images

#     def upload_images(self, base64_images, shop):
#         images_ids = []
#         for img_data in base64_images:
#             img_id = callUploadImage(access_token=shop.access_token, img_data=img_data)
#             images_ids.append(img_id)

#         return images_ids

#     def create_product(self, shop, category_id, warehouse_id, row_data, images_ids):
#         for item in images_ids:
#             print(item)
#         title = row_data.get('title', '')
#         print(title)

#         createProduct(shop.access_token, category_id, warehouse_id, title, images_ids)



@method_decorator(csrf_exempt, name='dispatch')
class ProcessExcel(View):

    def post(self, request, shop_id):
        try:
            data = json.loads(request.body.decode('utf-8'))

            # Lấy dữ liệu từ JSON
            excel_data = data.get('excel', [])
            category_id = data.get('category_id', '')
            warehouse_id = data.get('warehouse_id', '')
            is_cod_open = data.get('is_cod_open', '')
            package_height = data.get('package_height', 1)
            package_length = data.get('package_length', 1)
            package_weight = data.get('package_weight', "1")
            package_width = data.get('package_width', 1)
            description = data.get('description','')
            skus = data.get('skus', [])

            shop = Shop.objects.get(id=shop_id)

            with ThreadPoolExecutor() as executor:
                futures = []
                for item in excel_data:
                    row_data = {
                        'title': item.get('title', ''),
                        'images': item.get('images', {}),
                    }
                    futures.append(executor.submit(self.process_item, item, shop, category_id, warehouse_id,is_cod_open, package_height,package_length,package_weight,package_width,description,skus))

                for future in futures:
                    future.result()

            return JsonResponse({'status': 'success'}, status=201)

        except ObjectDoesNotExist as e:
            return HttpResponse({'error': str(e)}, status=404)
        except Exception as e:
            print(traceback.format_exc())
            return HttpResponse({'error': str(e)}, status=400)
        
    def process_item(self, item, shop, category_id, warehouse_id,is_cod_open, package_height,package_length,package_weight,package_width,description,skus):
        title = item.get('title', '')
        images = item.get('images', [])

        downloaded_image_paths = []

        with ThreadPoolExecutor() as executor:
            image_futures = []

            for key, image_url in images.items():
                image_futures.append(executor.submit(self.download_image, image_url, key, shop))

            for future in image_futures:
                result = future.result()
                if result:
                    downloaded_image_paths.append(result)

        base64_images = self.process_images(downloaded_image_paths)
        images_ids = self.upload_images(base64_images, shop)
        self.create_product_fun(shop,item, category_id, warehouse_id, is_cod_open, package_height,package_length,package_weight,package_width,images_ids,description, skus)

    def download_image(self, image_url, key, shop):
        if image_url:
            download_dir = 'C:/anhtiktok'  # Đường dẫn lưu trữ hình ảnh
            os.makedirs(download_dir, exist_ok=True)
            random_string = str(uuid.uuid4())[:8]
            image_filename = os.path.join(download_dir, f"{key}_{random_string}.jpg")
            response = requests.get(image_url)

            if response.status_code == 200:
                with open(image_filename, 'wb') as f:
                    f.write(response.content)
                return image_filename

    def process_images(self, downloaded_image_paths):
        base64_images = []
        for image_path in downloaded_image_paths:
            try:
                img = Image.open(image_path)
            except UnidentifiedImageError as e:
                if e.args[0] == 'WebP':
                   
                    with open(image_path, 'rb') as img_file:
                        base64_image = base64.b64encode(img_file.read()).decode('utf-8')
                        base64_images.append(base64_image)
                    continue
                else:
                    raise

            try:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                if not hasattr(img, 'bits') or img.bits != 8: 
                    
                    img = img.convert('PNG')

                with open(image_path, 'rb') as img_file:
                    base64_image = base64.b64encode(img_file.read()).decode('utf-8')
                    base64_images.append(base64_image)
            except Exception as e:
                print(f"Error processing image: {image_path}, {str(e)}")
        print("countttttttttttttt", len(base64_images))
        return base64_images

    def upload_images(self, base64_images, shop):
        images_ids = []
        for img_data in base64_images:
            img_id = callUploadImage(access_token=shop.access_token, img_data=img_data)
            images_ids.append(img_id)

        return images_ids

    def create_product_fun(self, shop, item, category_id, warehouse_id, is_cod_open, package_height, package_length, package_weight, package_width, images_ids, description, skus):
        title = item.get('title', '')
        product_object = ProductCreateObject(
            is_cod_open=is_cod_open,
            package_dimension_unit="metric",
            package_height=package_height,
            package_length=package_length,
            package_weight=package_weight,
            package_width=package_width,
            category_id=category_id,
            warehouse_id=warehouse_id,
            description=description,
            skus=skus
        )
        print(product_object.to_json)

        createProduct(shop.access_token, title, images_ids, product_object)


class EditProductAPIView(APIView):
    def get(self, request, shop_id, product_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)
        
        product_object = ProductObject(**product_data)

        response = callEditProduct(access_token, product_object)

        return JsonResponse({"status_code": response.status_code, "response_text": response.json})
