from ....models import Shop

from api.views import *

logger = logging.getLogger('views.tiktok.order_action')
setup_logging(logger, is_root=False, level=logging.INFO)

"""Orders"""


class ListOrder(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)

        response = order.callOrderList(access_token=shop.access_token)

        content = response.content

        logger.info(f'ListOrder response: {content}')

        return HttpResponse(content, content_type='application/json')


class OrderDetail(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        responseOrderList = order.callOrderList(access_token=access_token)

        if responseOrderList.json()['data']['total'] == 0:
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

        response = order.callOrderDetail(access_token=access_token, orderIds=orderIds)

        logger.info(f'OrderDetail response: {response.content}')

        content = response.content

        return HttpResponse(content=content, content_type='application/json')


"""Labels"""


class ShippingLabel(APIView):

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        data = json.loads(request.body.decode('utf-8'))
        doc_urls = []
        order_ids = data.get('order_ids', [])

        for order_id in order_ids:
            doc_url = order.callGetShippingDocument(access_token=access_token, order_id=order_id)
            doc_urls.append(doc_url)
            logger.info(f'Call Shipping Label for Order ID {order_id} url: {doc_url}')

        response = {
            'code': 200,
            'data': {
                'doc_urls': doc_urls
            }
        }

        return JsonResponse(response, content_type='application/json')


class ShippingService(APIView):

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        body_raw = request.body.decode('utf-8')
        service_info = json.loads(body_raw)

        response = order.callGetShippingService(access_token, service_info)
        data_json_string = response.content.decode('utf-8')

        data = json.loads(data_json_string)
        data_inner = data.get("data")
        shipping_services = data_inner.get("shipping_service_info", [])

        simplified_shipping_services = [
            {
                "id": service.get("id"),
                "name": service.get("name")
            } for service in shipping_services
        ]

        response_data = {
            "data": simplified_shipping_services,
            "message": "Success",
        }
        return JsonResponse(response_data, status=200)

    def call_get_shipping_service(self, access_token, service_info):
        return order.callGetShippingService(access_token, service_info)


"""Packages"""


class AllCombinePackage(APIView):
    # permission_classes =(IsAuthenticated,)

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        try:
            response = order.callPreCombinePackage(access_token=access_token)

            data_json_string = response.content.decode('utf-8')
            data = json.loads(data_json_string)
            response_data = {
                "code": 0,
                "data": data,
                "message": "Success",

            }
            return JsonResponse(response_data, status=200)
        except Exception as e:
            logger.error(f'Error when getting all combine package', exc_info=e)
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


class ConfirmCombinePackage(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode('utf-8')
        body_raw_json = json.loads(body_raw)

        response = order.callConFirmCombinePackage(
            access_token=access_token,
            body_raw_json=body_raw_json
        )
        data_json_string = response.content.decode('utf-8')
        data = json.loads(data_json_string)

        logger.info(f'ConfirmCombinePackage response: {data}')

        response_data = {
            "code": 0,
            "data": data,
            "message": "Success",

        }
        return JsonResponse(response_data, status=200)


class SearchPackage(APIView):

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        respond = order.callSearchPackage(access_token)
        data_json_string = respond.content.decode('utf-8')
        data = json.loads(data_json_string)

        response_data = {
            "data": data,
            "message": "Success",
        }

        return JsonResponse(response_data, status=200)


class PackageDetail(APIView):

    def post(self, request, shop_id):
        package_ids = json.loads(request.body.decode('utf-8'))
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        data_main = []

        # Sử dụng ThreadPoolExecutor để thực hiện các cuộc gọi API đa luồng
        with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
            futures = []
            for package_id in package_ids:
                futures.append(executor.submit(order.callGetPackageDetail, access_token, package_id))

            # Thu thập kết quả từ các future và thêm vào danh sách data_main
            for future in futures:
                respond = future.result()
                data_json_string = respond.content.decode('utf-8')
                data = json.loads(data_json_string)
                data["data"]["package_id"] = str(data["data"]["package_id"])
                data_main.append(data)

        response_data = {
            "data": data_main,
            "message": "Success",
        }
        return JsonResponse(response_data, status=200)
