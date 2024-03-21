import base64
import json
import logging
import os
import platform
import uuid
from concurrent.futures import ThreadPoolExecutor

import requests
from PIL import Image

from api import helpers, setup_logging
from api.utils import constant, objectcreate
from api.utils.tiktok_base_api import product
from api.views import (
    APIView,
    HttpResponse,
    JsonResponse,
    ObjectDoesNotExist,
    Response,
    View,
    csrf_exempt,
    get_object_or_404,
    method_decorator,
    status,
)

from ....models import Brand, Categories, Shop

logger = logging.getLogger('api.views.tiktok.product')
setup_logging(logger, is_root=False, level=logging.INFO)

"""Product"""


class ListProduct(APIView):

    def get(self, request, shop_id: str, page_number: str):
        shop = get_object_or_404(Shop, id=shop_id)

        try:
            response = product.callProductList(access_token=shop.access_token, page_number=page_number)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when get list products in page_number {page_number}', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': 'Có lỗi xảy ra khi lấy danh sách sản phẩm từ TikTok',
                    'data': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        else:
            content = response.content
            return HttpResponse(content, content_type='application/json')


class ProductDetail(APIView):

    def get(self, request, shop_id, product_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        try:
            response = product.callProductDetail(access_token=access_token, product_id=product_id)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when get product detail with product_id {product_id}', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': 'Có lỗi xảy ra khi lấy chi tiết sản phẩm từ TikTok',
                    'data': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        else:
            content = response.content
            return HttpResponse(content, content_type='application/json')


class CreateOneProduct(APIView):

    def upload_images(self, base64_images, access_token):
        images_ids = []

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(product.callUploadImage, access_token, img_data) for img_data in base64_images]

            for idx, future in enumerate(futures):
                logger.info(f'User {self.request.user}: Upload image [{idx} | {len(futures)}] result: {future.result()}', exc_info=True)
                img_id = future.result()
                if img_id:
                    images_ids.append(img_id)

        return images_ids

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)
        base64_images = product_data.pop('images', [])
        base64_images_size_chart = product_data.get('size_chart')

        try:
            images_ids = self.upload_images(base64_images, access_token)
        except Exception as e:
            logger.error(f'User {request.user}: Error when upload images', exc_info=e)

        try:
            images_id_size_chart = product.callUploadImage(access_token, base64_images_size_chart.get('img_id'))
        except Exception as e:
            logger.error(f'User {request.user}: Error when upload size chart image', exc_info=e)
            images_id_size_chart = ''

        product_object = None
        try:
            product_object = constant.ProductCreateOneObject(
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
                skus=product_data.get("skus"),
                product_attributes=product_data.get("product_attributes"),
                size_chart=images_id_size_chart
            )
        except Exception as e:
            logger.error('Error when create product object from request body', exc_info=e)
            return JsonResponse({
                'status': 'error',
                'message': 'Error occurred while creating product object'}, status=500)

        try:
            response = product.callCreateOneProduct(access_token, product_object)
            response_data = response.json()
            if response_data['data'] is None:
                error_message = response_data['message']

                logger.error(
                    f'User {request.user}: Error when create product: {error_message}')

                return JsonResponse({'message': error_message}, status=400)
            else:
                response_text = response.text
                return HttpResponse(response_text, content_type="text/plain", status=200)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when create product', exc_info=e)
            return JsonResponse({'message': 'Error occurred while calling create product API'}, status=400)


class CreateOneProductDraf(APIView):

    def upload_images(self, base64_images, access_token):
        images_ids = []

        for img_data in base64_images:
            if img_data is not None:
                img_id = product.callUploadImage(access_token=access_token, img_data=img_data)
                if img_id != "":
                    images_ids.append(img_id)

        return images_ids

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)
        base64_images = product_data.get('images', [])

        images_ids = self.upload_images(base64_images=base64_images, access_token=access_token)

        product_object = constant.ProductCreateOneObject(
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
            skus=product_data.get("skus"),
            product_attributes=product_data.get("product_attributes")
        )

        product.callCreateOneProductDraf(access_token, product_object)

        return JsonResponse({'status': 'success'}, status=201)


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
            size_chart = data.get('size_chart', '')

            shop = Shop.objects.get(id=shop_id)

            with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
                futures = []
                for item in excel_data:
                    futures.append(executor.submit(self.process_item, item, shop, category_id, warehouse_id, is_cod_open,
                                                   package_height, package_length, package_weight, package_width, description, skus, size_chart))

                for future in futures:
                    future.result()

            return JsonResponse({'status': 'success'}, status=201)

        except ObjectDoesNotExist as e:
            return HttpResponse({'error': str(e)}, status=404)
        except Exception as e:
            logger.error('Error when process excel file', exc_info=e)
            return HttpResponse({'error': str(e)}, status=400)

    def process_item(self, item, shop, category_id, warehouse_id, is_cod_open, package_height, package_length,
                     package_weight, package_width, description, skus, size_chart):
        images = item.get('images', [])

        downloaded_image_paths = []

        with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
            image_futures = []
            fixed_images = []
            base64_images = []

            for key, image_url in images.items():
                if image_url.startswith("https"):
                    image_futures.append(executor.submit(self.download_image, image_url, key))
                else:
                    base64_images.append(image_url)

            for future in image_futures:
                result = future.result()
                if result:
                    downloaded_image_paths.append(result)

        base_temp = self.process_images(downloaded_image_paths)

        base_temp.extend(base64_images)

        images_ids = self.upload_images(base_temp, shop)
        self.create_product_fun(shop, item, category_id, warehouse_id, is_cod_open, package_height, package_length,
                                package_weight, package_width, images_ids, description, skus, size_chart)

    def download_image(self, image_url, col):
        if image_url:
            download_dir = constant.DOWNLOAD_IMAGES_DIR_WINDOW if platform.system() == 'Windows' else constant.DOWNLOAD_IMAGES_DIR_UNIX
            os.makedirs(download_dir, exist_ok=True)
            random_string = str(uuid.uuid4())[:8]
            image_filename = os.path.join(download_dir, f"_{col}_{random_string}.jpg")
            response = requests.get(image_url)

            if response.status_code == 200:
                with open(image_filename, 'wb') as f:
                    f.write(response.content)

                return image_filename
            else:
                logger.error(f"Failed to download image: {image_url}, Status code: {response.status_code}", exc_info=True)
                return None

    def convert_to_base64(self, image_path):
        try:
            with open(image_path, "rb") as img_file:
                # Đọc dữ liệu từ tệp ảnh
                img_data = img_file.read()
                # Chuyển đổi dữ liệu ảnh thành chuỗi base64
                base64_data = base64.b64encode(img_data).decode("utf-8")
                return base64_data
        except Exception as e:
            logger.error(f"Error converting image to base64", exc_info=e)
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
                logger.error(f"Error processing image: {image_path}", exc_info=e)

        return base64_images

    def upload_images(self, base64_images, shop):
        # Sử dụng ThreadPoolExecutor để thực hiện đa luồng cho các công việc upload ảnh
        with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
            futures = [executor.submit(product.callUploadImage, access_token=shop.access_token, img_data=img_data) for img_data in base64_images]

            # Chờ cho tất cả các future kết thúc và lấy kết quả
            images_ids = [future.result() for future in futures if future.result()]

        return images_ids

    def create_product_fun(self, shop, item, category_id, warehouse_id, is_cod_open, package_height, package_length,
                           package_weight, package_width, images_ids, description, skus, size_chart):
        title = item.get('title', '')
        seller_sku = item.get('sku', '')
        for iteem in skus:
            iteem["seller_sku"] = seller_sku
        if size_chart != "":
            print("co size chart")

        product_object = objectcreate.ProductCreateMultiObject(
            is_cod_open=is_cod_open,
            package_dimension_unit="metric",
            package_height=package_height,
            package_length=package_length,
            package_weight=package_weight,
            package_width=package_width,
            category_id=category_id,
            warehouse_id=warehouse_id,
            description=description,
            skus=skus,
            size_chart=size_chart
        )

        product.createProduct(shop.access_token, title, images_ids, product_object)


class EditProduct(APIView):

    def put(self, request, shop_id, product_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        product_data = json.loads(body_raw)

        # Tạo một bản sao của product_data để loại bỏ imgBase64
        product_data_without_img = product_data.copy()
        img_base64 = product_data_without_img.pop('imgBase64', [])

        # Tạo một đối tượng ProductObject không chứa imgBase64
        product_object_data = {key: value for key, value in product_data.items() if key != 'imgBase64'}
        try:
            product_object = helpers.ProductObject(**product_object_data)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when create product object from request body', exc_info=e)
            return JsonResponse({'message': 'Error occurred while creating product object'}, status=500)

        try:
            response = product.callEditProduct(access_token, product_object, img_base64)
            response_data = response.json()
            if response_data['data'] is None:
                error_message = response_data['message']

                logger.error(
                    f'User {request.user}: Error when edit product with product_id {product_id}: {error_message}')

                return JsonResponse({'message': error_message}, status=400)

            else:
                return HttpResponse(response.text, content_type="text/plain", status=200)

        except Exception as e:
            logger.error(
                f'User {request.user}: Error when edit product with product_id {product_id}', exc_info=e)
            return JsonResponse({'message': 'Error occurred while calling edit product API'}, status=400)


"""Category"""


class CategoryRecommend(APIView):
    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')

        product_title_json = json.loads(body_raw)
        data = product_title_json.get("product_name", "")

        response = product.categoryRecommend(access_token, data)
        response_data = {
            "category": json.loads(response.content.decode('utf-8')),
            "message": "Success",
        }
        return JsonResponse(response_data, status=200)


class GlobalCategory(APIView):
    def get(self, request):
        categories = Categories.objects.get(id=1)
        return Response(categories.data, status=status.HTTP_200_OK)


class CategoriesByShopId(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        try:
            response = product.getCategories(access_token=access_token)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when get categories from TikTok', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': 'Có lỗi xảy ra khi lấy categories từ TikTok',
                    'data': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if response.status_code == 200:
            json_data = response.json
            categories = json_data.get('data', {}).get('category_list', [])

            data = {
                'code': 0,
                'data': {'category_list': categories}
            }

            return JsonResponse(data, status=status.HTTP_200_OK)

        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


class CategoriesIsLeaf(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        try:
            response = product.getCategories(access_token=access_token)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when get categories from TikTok', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': 'Có lỗi xảy ra khi lấy categories từ TikTok',
                    'data': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if response.status_code == 200:
            json_data = response.json
            categories = json_data.get('data', {}).get('category_list', [])

            filtered_categories = [category for category in categories if category.get('is_leaf', False)]

            data = {
                'code': 0,
                'data': {'category_list': filtered_categories}
            }

            return JsonResponse(data, status=status.HTTP_200_OK)

        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


"""Brand"""


class GlobalBrand(APIView):
    def get(self, request):
        categories = Brand.objects.get(id=1)
        return Response(categories.data, status=status.HTTP_200_OK)


class GetAllBrands(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        response = product.getBrands(access_token=shop.access_token)

        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


"""Warehouse"""


class WareHouse(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        try:
            response = product.getWareHouseList(access_token=access_token)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when get warehouse list from TikTok', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': 'Có lỗi xảy ra khi lấy warehouse list từ TikTok',
                    'data': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


"""Attribute"""


class Attributes(APIView):

    def get(self, request, shop_id):
        category_id = request.query_params.get('category_id')
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        try:
            response = product.getAttributes(access_token=access_token, category_id=category_id)
        except Exception as e:
            logger.error(
                f'User {request.user}: Error when get attributes from TikTok', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': 'Có lỗi xảy ra khi lấy attributes từ TikTok',
                    'data': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return HttpResponse(response.content, content_type='application/json', status=response.status_code)


class GetProductAttribute(APIView):

    def get(self, request, shop_id, category_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        data = product.callGetAttribute(access_token, category_id)
        return JsonResponse(data, status=200)


"""Image"""


class UploadImage(APIView):
    def post(self, request, shop_id):
        image_data = request.data.get('img_data')
        shop = get_object_or_404(Shop, id=shop_id)

        if image_data:
            try:
                image_base64 = base64.b64encode(image_data.read()).decode('utf-8')

                response = product.callUploadImage(access_token=shop.access_token, img_data=image_base64)

                return HttpResponse(response.content, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f'User {request.user}: Error when encode image to base64', exc_info=e)
                return Response(
                    {
                        'status': 'error',
                        'message': 'Có lỗi xảy ra encode base64 ảnh',
                        'data': str(e)
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {
                    'status': 'error',
                    'message': 'Không có dữ liệu ảnh'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
