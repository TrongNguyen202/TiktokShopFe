import PIL
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
from .helpers import send_mail_verification, GenerateSign,is_webp_image_without_bits,ProductObject
from .serializers import (
    SignUpSerializers,
    VerifySerializers,
    ShopSerializers,
    ShopRequestSerializers,
    TemplateSerializer,
    TemplatePutSerializer
)

from api.utils.tiktok_api import callProductList, getAccessToken, refreshToken, callProductDetail, getCategories, getWareHouseList, callUploadImage, createProduct,getBrands, callEditProduct, callOrderList, callOrderDetail, getAttributes,callCreateOneProduct,callGlobalCategories,callGetShippingDocument,callGetAttribute,callCreateOneProductDraf
from django.http import HttpResponse
from .models import Shop, Image, Templates, Categories,UserShop,UserGroup,GroupCustom
from api.utils.constant import app_key, secret, grant_type,ProductCreateObject,ProductCreateOneObject,MAX_WORKER
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
from .models import Shop,Brand

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
        
        return HttpResponse(content, content_type='application/json')

# create shop
    
# order list by Shop
class ListOrder(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)

        response = callOrderList(access_token=shop.access_token)
        content = response.content
        print("content", content)
        return HttpResponse(content, content_type='application/json')

class OrderDetail(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        responseOrderList = callOrderList(access_token=access_token)
        if(responseOrderList.json()['data']['total'] == 0): 
            orderIds = []
            content = {
                'code': 200,
                'data': {
                    'order_list': []
                }
            }
            return JsonResponse(content, content_type='application/json')
        else: 
            orders = responseOrderList.json()['data']['order_list']
            orderIds = [order['order_id'] for order in orders]
        response = callOrderDetail(
            access_token=access_token, orderIds=orderIds)
        
        print("response", response)

        content = response.content
        return HttpResponse(content, content_type='application/json')

from .models import UserGroup
class Shops(APIView):
    permission_classes =  (IsAuthenticated,)
    def get_user_group(self, user):
        try:
            user_group = UserGroup.objects.get(user=user)
            return user_group.group_custom
        except UserGroup.DoesNotExist:
            return None
    def get_shop_list(self, group):
        # Lấy danh sách cửa hàng thuộc nhóm
        shops = Shop.objects.filter(group_custom_id=group)
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
        user = request.user

        # Lấy thông tin nhóm của người dùng
        user_group = self.get_user_group(user)

        # Nếu không có thông tin nhóm, trả về một Response phù hợp
        if user_group is None:
            return Response({'error': 'User does not belong to any group'}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy danh sách cửa hàng thuộc nhóm của người dùng
        shops = self.get_shop_list(user_group)
        serializer = ShopSerializers(shops, many=True)

        return Response(serializer.data)

class ShopList(APIView):
    def get(self, request):
        user_shop = UserShop.objects.filter(user = request.user)
        shops = Shop.objects.filter(id= user_shop.shop.id)
        serializer = ShopSerializers(shops, many=True)
        return Response(serializer.data)


class ShopListAPI(APIView):
    def get(self, request):
        
        shops = Shop.objects.filter()
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


class CategoriesByShopId(APIView):

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

class GlobalCategory(APIView):
     def get(self, request):
       categories = Categories.objects.get(id = 1)

       return Response(categories.data, status=status.HTTP_200_OK)
class GlobalBrand(APIView):
     def get(self, request):
       categories = Brand.objects.get(id = 1)

       return Response(categories.data, status=status.HTTP_200_OK)
class WareHouse(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        response = getWareHouseList(access_token=access_token)
        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


class Attributes(APIView):

    def get(self, request, shop_id):
        category_id = request.query_params.get('category_id')
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        response = getAttributes(access_token=access_token, category_id=category_id)
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
from .models import Templates  # import model

class TemplateList(APIView):  # đổi tên thành TemplateList
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        user = self.request.user
        templates = Templates.objects.filter(user=user)
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data)
    def post(self, request):
        template = Templates.objects.create(
            name = request.data.get('name'),
            category_id = request.data.get('category_id'),
            description = request.data.get('description'),
            is_cod_open = request.data.get('is_cod_open'),
            package_height = request.data.get('package_height'),
            package_length = request.data.get('package_length'),
            package_weight = request.data.get('package_weight'),
            package_width = request.data.get('package_width'),
            sizes = request.data.get('sizes'),
            colors = request.data.get('colors'),
            type = request.data.get('type'),
            types = request.data.get('types'),
            user = self.request.user
        )
        template.save()
        return Response({'message': 'Template created successfully'}, status=status.HTTP_201_CREATED)
    def put(self, request, template_id):
        template = get_object_or_404(Templates, id=template_id)
       
        template_serializer = TemplatePutSerializer(template, data=request.data)
        if template_serializer.is_valid():
            template_serializer.save()
            return Response(template_serializer.data, status=200)
        else:
            return Response(template_serializer.errors, status=400)
    def delete(self, request, template_id):
        template = get_object_or_404(Templates, id=template_id)
        try:
            template.delete()
            return Response({'message': 'Template deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': f'Failed to delete template: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
                            download_dir = 'E:/anhtiktok'
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

                    createProduct(shop.access_token, request.data.get('category_id'),
                                  request.data.get('warehouse_id'), title, images_ids)

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
import base64
import json
import os
import traceback
import uuid
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
import requests


@method_decorator(csrf_exempt, name='dispatch')
class ProcessExcel(View):

    def post(self, request, shop_id):
        try:
            data = json.loads(request.body.decode('utf-8'))

            excel_data = data.get('excel', [])
            category_id = data.get('category_id', '')
          
            warehouse_id = data.get('warehouse_id', '')
            is_cod_open = data.get('is_cod_open', '')
            package_height = data.get('package_height', 1)
            package_length = data.get('package_length', 1)
            package_weight = data.get('package_weight', "1")
            package_width = data.get('package_width', 1)
            description = data.get('description', '')
            skus = data.get('skus', [])

            shop = Shop.objects.get(id=shop_id)

            with ThreadPoolExecutor() as executor:
                futures = []
                for item in excel_data:
                    row_data = {
                        'title': item.get('title', ''),
                        'images': item.get('images', {}),
                    }
                    futures.append(executor.submit(self.process_item, item, shop, category_id, warehouse_id, is_cod_open,
                                                   package_height, package_length, package_weight, package_width, description, skus))

                for future in futures:
                    future.result()

            return JsonResponse({'status': 'success'}, status=201)

        except ObjectDoesNotExist as e:
            return HttpResponse({'error': str(e)}, status=404)
        except Exception as e:
            print(traceback.format_exc())
            return HttpResponse({'error': str(e)}, status=400)

    def process_item(self, item, shop, category_id, warehouse_id, is_cod_open, package_height, package_length,
                     package_weight, package_width, description, skus):
        title = item.get('title', '')
        images = item.get('images', [])

        downloaded_image_paths = []

        with ThreadPoolExecutor(max_workers=MAX_WORKER) as executor:
            image_futures = []

            for key, image_url in images.items():
                image_futures.append(executor.submit(self.download_image, image_url, key))

            for future in image_futures:
                result = future.result()
                if result:
                    downloaded_image_paths.append(result)

        base64_images = self.process_images(downloaded_image_paths)
        images_ids = self.upload_images(base64_images, shop)
        self.create_product_fun(shop, item, category_id, warehouse_id, is_cod_open, package_height, package_length,
                                package_weight, package_width, images_ids, description, skus)
    def convert_to_png(self, input_path, output_path):
        try:
            # Mở ảnh sử dụng PIL
            img = Image.open(input_path)
            # Chuyển đổi và lưu ảnh dưới dạng PNG
            img.save(output_path, format='PNG')
        except Exception as e:
            print(f"Lỗi khi chuyển đổi ảnh sang PNG: {e}")

    def download_image(self, image_url, col):
        if image_url:
            download_dir = 'C:/anhtiktok'  # Update with your desired directory
            os.makedirs(download_dir, exist_ok=True)
            random_string = str(uuid.uuid4())[:8]
            image_filename = os.path.join(download_dir, f"_{col}_{random_string}.jpg")
            response = requests.get(image_url)

            if response.status_code == 200:
                with open(image_filename, 'wb') as f:
                    f.write(response.content)



                return image_filename
            else:
                print(f"Failed to download image: {image_url}, Status code: {response.status_code}")
                return None

    def process_images(self, downloaded_image_paths):
        base64_images = []
        for image_path in downloaded_image_paths:
            try:
                img = Image.open(image_path)
                if img is None:
                    continue
                

                with open(image_path, 'rb') as img_file:
                    base64_image = base64.b64encode(img_file.read()).decode('utf-8')
                    base64_images.append(base64_image)
            except Exception as e:
                print(f"Error processing image: {image_path}, {str(e)}")

        return base64_images

    def upload_images(self, base64_images, shop):
    # Use list comprehension to call callUploadImage for each img_data
       images_ids = [callUploadImage(access_token=shop.access_token, img_data=img_data) for img_data in base64_images]

    # Filter out empty strings from the list
       images_ids = [img_id for img_id in images_ids if img_id != ""]

       return images_ids


    def create_product_fun(self, shop, item, category_id, warehouse_id, is_cod_open, package_height, package_length,
                            package_weight, package_width, images_ids, description, skus):
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
        

        createProduct(shop.access_token, title, images_ids, product_object)








# class EditProductAPIView(APIView):
#     def get(self, request, shop_id, product_id):
#         shop = get_object_or_404(Shop, id=shop_id)
#         access_token = shop.access_token
#         body_raw = request.body.decode('utf-8')
#         product_data = json.loads(body_raw)

#         print(product_data.get("skus")[0].get("sales_attributes"))
        
#         product_object = ProductObject(

#         )

#         response = callEditProduct(access_token, product_object)

#         return JsonResponse({"status_code": response.status_code, "response_text": response.json})
        

# class EditProductAPIView(APIView):
#     def get(self, request, shop_id, product_id):
#         shop = get_object_or_404(Shop, id=shop_id)
#         access_token = shop.access_token
#         body_raw = request.body.decode('utf-8')
#         product_data = json.loads(body_raw)
#         print(product_data.get("skus"))
#         product_object = ProductObject(
#             product_id=product_data.get("product_id"),
#             product_name=product_data.get("product_name"),
#             images=product_data.get("images", []),
#             price=product_data.get("price"),
#             is_cod_open=product_data.get("is_cod_open"),
#             package_dimension_unit=product_data.get("package_dimension_unit"),
#             package_height=product_data.get("package_height"),
#             package_length=product_data.get("package_length"),
#             package_weight=product_data.get("package_weight"),
#             package_width=product_data.get("package_width"),
#             category_id=product_data.get("category_id"),
#             description=product_data.get("description"),
#             skus= product_data.get("skus")
#         )
#         print("class product la ",product_object)

#         response = callEditProduct(access_token, product_object)

#         return JsonResponse({"status_code": response.status_code, "response_text": response.json})
class EditProductAPIView(APIView):
    def put(self, request, shop_id, product_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)

        # Tạo một bản sao của product_data để loại bỏ imgBase64
        product_data_without_img = product_data.copy()
        img_base64 = product_data_without_img.pop('imgBase64', [])
        

        # Tạo một đối tượng ProductObject không chứa imgBase64
        product_object_data = {key: value for key, value in product_data.items() if key != 'imgBase64' }
       
        product_object = ProductObject(**product_object_data)



        callEditProduct(access_token, product_object, img_base64)

        return JsonResponse({'status': 'success'}, status=200)
import base64
from PIL import Image
import io  
class CreateOneProduct(APIView):
    # permission_classes = (IsAuthenticated,)


    def upload_images(self, base64_images, access_token):
       images_ids = []
       for img_data in base64_images:
           bits = self.count_bits(img_data)
           if bits is not None and bits > 24:
               img_data = self.convert_to_rgb(img_data)
           if img_data is not None:
               img_id = callUploadImage(access_token, img_data=img_data)
               if img_id !="":
                   images_ids.append(img_id)
       return images_ids
    
    def base64_to_image(base64_string, output_path):
       image_data = base64.b64decode(base64_string)
       image = Image.frombytes('I', (32, 32), image_data, 'raw', 'I;16')
       image.save(output_path)

    def image_to_base64(image_path):
       with open(image_path, "rb") as image_file:
           encoded_string = base64.b64encode(image_file.read())
           return encoded_string.decode('utf-8')

    def convert_to_png(self, input_path, output_path):
        try:
            # Mở ảnh sử dụng PIL
            img = Image.open(input_path)
            # Chuyển đổi và lưu ảnh dưới dạng PNG
            img.save(output_path, format='PNG')
        except Exception as e:
            print(f"Lỗi khi chuyển đổi ảnh sang PNG: {e}")

    def post(self, request,shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)
        base64_images = product_data.get('images', [])
        for i, base64_data in enumerate(base64_images):
            output_path = f"C:/anhtiktok/output_{i + 1}.jpg"
            
            self.base64_to_image(base64_data, output_path)
            base64_data = self.image_to_base64(image_path=output_path)

        images_ids = self.upload_images(base64_images=base64_images, access_token=access_token)

        product_object = ProductCreateOneObject(
            product_name=product_data.get("product_name"),
            images=images_ids,
            is_cod_open=product_data.get("is_cod_open"),
            package_dimension_unit=product_data.get("package_dimension_unit"),
            package_height=product_data.get("package_height"),
            package_length=product_data.get("package_length"),
            package_weight=product_data.get("package_weight"),
            package_width=product_data.get("package_width"),
            category_id=product_data.get("category_id"),
            brand_id=product_data.get("brand_id"),
            description=product_data.get("description"),
            skus= product_data.get("skus")
        )
        

        callCreateOneProduct(access_token, product_object)

        return JsonResponse({'status': 'success'}, status=201)

class ListCategoriesGlobal(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request,shop):
        response = callGlobalCategories(access_token=shop.access_token)
        content = response.content
        print("content", content)
        return HttpResponse(content, content_type='application/json')


class ShippingLabel(APIView):

    def post(self,request ,shop_id):
        shop = get_object_or_404(Shop, id= shop_id)
        access_token = shop.access_token
        data = json.loads(request.body.decode('utf-8'))
        doc_urls = []
        order_ids = data.get('order_ids', [])
        for order_id in order_ids:
           doc_url =  callGetShippingDocument(order_id=order_id, access_token=access_token)
           doc_urls.append(doc_url)
           print(doc_url)
        respond = {
                'code': 0,
                'data': {
                    'doc_urls': doc_urls
                }
            }

        return JsonResponse(respond)
    
from  api.utils.google.googleapi import upload_pdf
from  api.utils.google.googleapi import search_file
class UploadDriver(APIView):

    def post(self, request):
        try:
            data_post = json.loads(request.body.decode('utf-8'))
            order_documents = data_post.get('order_documents', [])

            for order_document in order_documents:
                order_id = order_document.get('order_id')
                doc_url = order_document.get('doc_url')

                if order_id and doc_url:
                    # Download the file from doc_url
                    response = requests.get(doc_url)
                    if response.status_code == 200:
                        # Save the file with order_id as the name
                        file_name = f"{order_id}.pdf"
                        file_path = os.path.join("C:\pdflabel", file_name)

                        with open(file_path, 'wb') as file:
                            file.write(response.content)

                        # Upload the file to Google Drive
                        upload_pdf(file_path, order_id)

            return JsonResponse({'status': 'success'}, status=201)

        except Exception as e:
            # Log the error
            print(f"Error in UploadDriver: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        


    

class SearchPDF(APIView):

    def get(self,request,order_id):
        file_name = str(order_id)
        try:
            result = search_file(file_name)

            return JsonResponse(result,safe=False, status=200)
        except Exception as e:
            print(f"Error in find PDF: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        

from api.utils.pdf.ocr_pdf import process_pdf
class ToShipOrderAPI(APIView):
    def ocr_infor(self, pdf_path):
        result_json_user = process_pdf(pdf_path=pdf_path)
        return result_json_user

    def post(self, request, shop_id):
        data = []
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        data_post = json.loads(request.body.decode('utf-8'))
        order_documents = data_post.get('order_documents', [])
        print(order_documents)

        for order_document in order_documents:
            order_id = order_document.get('order_id')
            doc_url = order_document.get('doc_url')

            if order_id:
                # Download the file from doc_url
                orderIds = [order_id]
                response = requests.get(doc_url)

                if response.status_code == 200:
                    # Save the file with order_id as the name
                    file_name = f"{order_id}.pdf"
                    file_path = os.path.join("C:\pdflabel", file_name)

                    with open(file_path, 'wb') as file:
                        file.write(response.content)

                    # Upload the file to Google Drive
                    order_detail = callOrderDetail(access_token=access_token, orderIds=orderIds)
                    order_detail = order_detail.json()
                    infor_user_str = process_pdf(file_path)
                    infor_user = json.loads(infor_user_str)

                    # trong da lam test
                    if 'tracking_id' in infor_user:
                        order_detail['tracking_id'] = infor_user['tracking_id']
                    if 'name_buyer' in infor_user:
                        order_detail['name_buyer'] = infor_user['name_buyer']
                    if 'real_street' in infor_user:
                        order_detail['street'] = infor_user['real_street']
                    if 'city' in infor_user:
                        order_detail['city'] = infor_user['city']
                    if 'state' in infor_user:
                        order_detail['state'] = infor_user['state']
                    if 'zip_code' in infor_user:
                        order_detail['zip_code'] = infor_user['zip_code']

                    data.append(order_detail)
            

            # Trả về kết quả sau khi loop hoàn thành
            return JsonResponse(data, status=200, safe=False)

    


class GetProductAttribute(APIView):

    def get(self, request,shop_id,category_id):
       shop = get_object_or_404(Shop, id=shop_id)
       access_token = shop.access_token
       data = callGetAttribute(access_token=access_token, category_id=category_id)
       return JsonResponse(data, status=200)


class CreateOneProductDraf(APIView):
    # permission_classes = (IsAuthenticated,)

    def count_bits(self, img_data):
       try:
           image = Image.open(io.BytesIO(base64.b64decode(img_data)))
           mode_to_bpp = {'1': 1, 'L': 8, 'P': 8, 'RGB': 24, 'RGBA': 32, 'CMYK': 32, 'YCbCr': 24, 'I': 32, 'F': 32}
           data = mode_to_bpp[image.mode]
           return data
       except PIL.UnidentifiedImageError:
           print("UnidentifiedImageError: Cannot identify image file")
           return None  # or another appropriate default value

      

       
    def convert_to_rgb(self, img_data):
        try:
            image = Image.open(io.BytesIO(base64.b64decode(img_data)))
            rgb_image = Image.new("RGB", image.size)
            rgb_image.paste(image)
            buffered = io.BytesIO()
            rgb_image.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')
        except Exception as e:
            return None
    def upload_images(self, base64_images, access_token):
       images_ids = []
       for img_data in base64_images:
           bits = self.count_bits(img_data)
           if bits is not None and bits > 24:
               img_data = self.convert_to_rgb(img_data)
           if img_data is not None:
               img_id = callUploadImage(access_token, img_data=img_data)
               if img_id !="":
                   images_ids.append(img_id)
       return images_ids
    
    def base64_to_image(base64_string, output_path):
       image_data = base64.b64decode(base64_string)
       image = Image.frombytes('I', (32, 32), image_data, 'raw', 'I;16')
       image.save(output_path)

    def image_to_base64(image_path):
       with open(image_path, "rb") as image_file:
           encoded_string = base64.b64encode(image_file.read())
           return encoded_string.decode('utf-8')

    def convert_to_png(self, input_path, output_path):
        try:
            # Mở ảnh sử dụng PIL
            img = Image.open(input_path)
            # Chuyển đổi và lưu ảnh dưới dạng PNG
            img.save(output_path, format='PNG')
        except Exception as e:
            print(f"Lỗi khi chuyển đổi ảnh sang PNG: {e}")

    def post(self, request,shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)
        base64_images = product_data.get('images', [])
        for i, base64_data in enumerate(base64_images):
            output_path = f"C:/anhtiktok/output_{i + 1}.jpg"
            output_path_png = f"C:/anhtiktok/outputpng_{i + 1}.png"
            self.base64_to_image(base64_data, output_path)
            self.convert_to_png(input_path=output_path, output_path=output_path_png)
            base64_data = self.image_to_base64(image_path=output_path_png)

        images_ids = self.upload_images(base64_images=base64_images, access_token=access_token)

        product_object = ProductCreateOneObject(
            product_name=product_data.get("product_name"),
            images=images_ids,
            is_cod_open=product_data.get("is_cod_open"),
            package_dimension_unit=product_data.get("package_dimension_unit"),
            package_height=product_data.get("package_height"),
            package_length=product_data.get("package_length"),
            package_weight=product_data.get("package_weight"),
            package_width=product_data.get("package_width"),
            category_id=product_data.get("category_id"),
            brand_id=product_data.get("brand_id"),
            description=product_data.get("description"),
            skus= product_data.get("skus"),
            product_attributes = product_data.get("product_attributes")
        )
        

        callCreateOneProductDraf(access_token, product_object)

        return JsonResponse({'status': 'success'}, status=201)


class PermissionRole(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user_id = data.get('user_id')
        user = get_object_or_404(User, id=user_id)

        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.save()

        stores = data.get('stores', [])
        # Do something with the stores list, for example, assign the user to the provided stores
        for store_id in stores:
            UserShop.objects.get_or_create(user=user, shop_id=store_id)

        return Response({"message": "User information updated successfully."})

    def isManagerOrAdmin(self, user):
        user_group = get_object_or_404(UserGroup, user=user)
        return user_group.role


class UserShopList(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        user = request.user
        users_groups = get_object_or_404(UserGroup, user=user)
        group_custom = users_groups.group_custom  
        
        user_shops_data = {"group_id": group_custom.id, "group_name": group_custom.group_name, "users": []}
         

        users_filter = []
        for user_group in group_custom.usergroup_set.filter(role=2):  
            user_data = {"user_id": user_group.user.id, "user_name":user_group.user.username, "shops": []}
           
            for user_shop in user_group.user.usershop_set.filter(shop__group_custom_id=group_custom.id):
                user_data["shops"].append({"id":user_shop.shop.id,"name":user_shop.shop.shop_name})
            
            user_shops_data["users"].append(user_data)
        
        return Response({"data": user_shops_data})
class UserInfor(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,  # Lấy first_name từ đối tượng User
            'last_name': user.last_name,    # Lấy last_name từ đối tượng User
        }
     
        return Response(user_info)

               
 