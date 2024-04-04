import json
import logging
import os
import platform
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

import requests

from api import setup_logging
from api.utils import constant
from api.utils.pdf.ocr_pdf import process_pdf_to_info
from api.utils.tiktok_base_api import order
from api.views import (
    APIView,
    FileResponse,
    HttpResponse,
    IntegrityError,
    IsAuthenticated,
    JsonResponse,
    PageNumberPagination,
    Q,
    Response,
    get_object_or_404,
    status,
)

from ....models import BuyedPackage, DesignSku, DesignSkuChangeHistory, GroupCustom, Package, Shop, UserGroup
from ....serializers import (
    BuyedPackageSeri,
    DesignSkuPutSerializer,
    DesignSkuSerializer,
    GroupCustomSerializer,
    PackageDeactiveSerializer,
    PackageSerializer,
)

logger = logging.getLogger("views.tiktok.order_action")
setup_logging(logger, is_root=False, level=logging.INFO)

"""Orders"""


class ListOrder(APIView):
    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)

        response = order.callOrderList(access_token=shop.access_token)
        content = response.content
        logger.info(f"ListOrder response: {content}")

        return HttpResponse(content, content_type="application/json")


class OrderDetail(APIView):
    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        responseOrderList = order.callOrderList(access_token=access_token, cursor="")
        data = []

        if responseOrderList.json()["data"]["total"] == 0:
            content = {"code": 200, "data": {"order_list": []}, "message": "Success"}
        else:
            orders = responseOrderList.json()["data"]["order_list"]

            orderIds = [order["order_id"] for order in orders]

            while responseOrderList.json()["data"]["more"]:
                next_cursor = responseOrderList.json()["data"]["next_cursor"]
                responseOrderList = order.callOrderList(access_token=access_token, cursor=next_cursor)
                new_orders = responseOrderList.json()["data"]["order_list"]
                orderIds.extend([order["order_id"] for order in new_orders])

            with ThreadPoolExecutor(max_workers=40) as executor:
                futures = []
                for i in range(0, len(orderIds), 50):
                    chunk_ids = orderIds[i : i + 50]
                    futures.append(
                        executor.submit(order.callOrderDetail, access_token=access_token, orderIds=chunk_ids)
                    )

                for future in futures:
                    response = future.result()
                    data.append(response.json())

        if not data:
            content = {"code": 200, "data": {"order_list": []}, "message": "Success"}
        else:
            content = {"code": 200, "data": data, "message": "Success"}

        return JsonResponse(content, safe=False)


"""Labels"""


class ShippingLabel(APIView):
    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        data = json.loads(request.body.decode("utf-8"))
        doc_urls = []
        order_ids = data.get("order_ids", [])

        for order_id in order_ids:
            doc_url = order.callGetShippingDocument(access_token=access_token, order_id=order_id)
            doc_urls.append(doc_url)
            logger.info(f"Call Shipping Label for Order ID {order_id} url: {doc_url}")

        response = {"code": 200, "data": {"doc_urls": doc_urls}}

        return JsonResponse(response, content_type="application/json")


class ShippingService(APIView):
    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token

        body_raw = request.body.decode("utf-8")
        service_info = json.loads(body_raw)

        response = order.callGetShippingService(access_token, service_info)
        data_json_string = response.content.decode("utf-8")

        data = json.loads(data_json_string)
        data_inner = data.get("data")
        print("data_inner", data_inner)
        shipping_services = data_inner.get("shipping_service_info", [])

        simplified_shipping_services = [
            {"id": service.get("id"), "name": service.get("name")} for service in shipping_services
        ]

        response_data = {
            "data": simplified_shipping_services,
            "message": "Success",
        }
        return JsonResponse(response_data, status=200)

    def call_get_shipping_service(self, access_token, service_info):
        return order.callGetShippingService(access_token, service_info)


class CreateLabel(APIView):
    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode("utf-8")
        label_datas = json.loads(body_raw)

        with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
            futures = []
            for label_data in label_datas:
                futures.append(executor.submit(self.call_create_label, access_token, label_data))

            datas = []
            for future in futures:
                datas.append(future.result())

        return Response({"data": datas, "message": "Buy label successfully."}, status=201)

    def call_create_label(self, access_token, label_data):
        respond = order.callCreateLabel(access_token=access_token, body_raw_json=label_data)
        data = json.loads(respond.content)
        print(data)

        # Check if package_id already exists
        try:
            buyedPkg, created = BuyedPackage.objects.get_or_create(package_id=data["data"]["package_id"])
            # If created is True, it means a new object was created
            if created:
                return json.loads(respond.content)
            else:
                return {"status": 404, "error": "Package is buyed label."}
        except IntegrityError:
            logger.error("Integrity error occurred when creating label", exc_info=True)
            return {"error": "Integrity error occurred"}


class PackageBought(APIView):
    def get(self, request):
        # Retrieve all instances of BuyedPackage
        buyed_packages = BuyedPackage.objects.all()

        # Serialize the queryset
        serializer = BuyedPackageSeri(buyed_packages, many=True)

        # Return serialized data as response
        return Response(serializer.data)


class PDFSearch(APIView):
    def get(self, request):
        PDF_DIRECTORY = constant.PDF_DIRECTORY_WINDOW if platform.system() == "Windows" else constant.PDF_DIRECTORY_UNIX
        os.makedirs(PDF_DIRECTORY, exist_ok=True)
        query = request.query_params.get("query", "")
        found_files = []

        for filename in os.listdir(PDF_DIRECTORY):
            if filename.endswith(".pdf") and query in filename:
                found_files.append(filename)

        return Response(found_files)


class PDFDownload(APIView):
    def get(self, request):
        PDF_DIRECTORY = constant.PDF_DIRECTORY_WINDOW if platform.system() == "Windows" else constant.PDF_DIRECTORY_UNIX
        filename = request.query_params.get("filename", "")
        file_path = os.path.join(PDF_DIRECTORY, filename)

        if os.path.exists(file_path):
            return FileResponse(open(file_path, "rb"), as_attachment=True)
        else:
            return Response({"message": "File not found"}, status=404)


"""Packages"""


class AllCombinePackage(APIView):
    # permission_classes =(IsAuthenticated,)

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        try:
            response = order.callPreCombinePackage(access_token=access_token)

            data_json_string = response.content.decode("utf-8")
            data = json.loads(data_json_string)
            response_data = {
                "code": 0,
                "data": data,
                "message": "Success",
            }
            return JsonResponse(response_data, status=200)
        except Exception as e:
            logger.error("Error when getting all combine package", exc_info=e)
            return JsonResponse({"status": "error", "message": str(e)}, status=500)


class ConfirmCombinePackage(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        body_raw = request.body.decode("utf-8")
        body_raw_json = json.loads(body_raw)

        response = order.callConFirmCombinePackage(access_token=access_token, body_raw_json=body_raw_json)
        data_json_string = response.content.decode("utf-8")
        data = json.loads(data_json_string)

        logger.info(f"ConfirmCombinePackage response: {data}")

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
        data_json_string = respond.content.decode("utf-8")
        data = json.loads(data_json_string)

        response_data = {
            "data": data,
            "message": "Success",
        }

        return JsonResponse(response_data, status=200)


class PackageDetail(APIView):
    def post(self, request, shop_id):
        package_ids = json.loads(request.body.decode("utf-8"))
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
                data_json_string = respond.content.decode("utf-8")
                data = json.loads(data_json_string)
                data["data"]["package_id"] = str(data["data"]["package_id"])
                data_main.append(data)

        response_data = {
            "data": data_main,
            "message": "Success",
        }
        return JsonResponse(response_data, status=200)


"""Design Skus"""


class CustomPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"


class DesignSkuListCreateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_user_group(self, user):
        user_group = UserGroup.objects.filter(user=user)
        if user_group.exists():
            return user_group[0].group_custom
        return None

    def get(self, request):
        group_custom = self.get_user_group(request.user)
        if group_custom:
            designskus = DesignSku.objects.filter(department=group_custom).order_by("-id")
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(designskus, request)
            serializer = DesignSkuSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response("Người dùng không thuộc bất kỳ nhóm nào.", status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        group_custom = self.get_user_group(request.user)
        user = request.user
        if group_custom and user:
            data = request.data
            for item in data:
                item["department"] = group_custom.pk
                item["user"] = user.id
            serializer = DesignSkuSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response("User does not belong to any group.", status=status.HTTP_404_NOT_FOUND)


class DesignSkuDetailAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk):
        try:
            return DesignSku.objects.get(pk=pk)
        except DesignSku.DoesNotExist:
            return None

    def get(self, request, pk):
        designsku = self.get_object(pk)
        if designsku:
            serializer = DesignSkuSerializer(designsku)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        designsku_data = request.data
        designsku = self.get_object(pk)

        if designsku:
            old_data = DesignSkuPutSerializer(designsku).data
            serializer = DesignSkuPutSerializer(designsku, data=designsku_data)
            if serializer.is_valid():
                serializer.save()

                user = request.user if request.user.is_authenticated else None
                changed_at = datetime.now()

                DesignSkuChangeHistory.objects.create(
                    design_sku=designsku, user=user, change_data=old_data, changed_at=changed_at
                )
                return Response("DesignSku updated successfully.", status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(f"DesignSku with ID {pk} does not exist.", status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        designsku = self.get_object(pk)
        if designsku:
            designsku.delete()
            return Response({"message": "DesignSku deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": f"DesignSku with ID {pk} does not exist."}, status=status.HTTP_404_NOT_FOUND)


class DesignSkuBySkuId(APIView):
    def get(self, request, sku_id):
        user = request.user
        print(user.username)  # In ra tên người dùng để kiểm tra
        user_group = UserGroup.objects.get(user=user)
        group_custom = user_group.group_custom
        design_skus = DesignSku.objects.get(department=group_custom, sku_id=sku_id)
        serializer = DesignSkuSerializer(design_skus)
        return Response(serializer.data)


class DesignSkuDepartment(APIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get(self, request, group_id):
        designskus = DesignSku.objects.filter(department=group_id).order_by("-id")
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(designskus, request)
        serializer = DesignSkuSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class DesignSkuSearch(APIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        search_query = data.get("search_query", None)
        group_id = data.get("group_id", None)

        designskus = DesignSku.objects.all()

        if group_id:
            try:
                group_id = int(group_id)
            except ValueError:
                return Response("Invalid group_id format", status=status.HTTP_400_BAD_REQUEST)
            print(designskus)
            designskus = designskus.filter(department_id=group_id)

        if search_query:
            designskus = designskus.filter(
                Q(sku_id__icontains=search_query)
                | Q(product_name__icontains=search_query)
                | Q(variation__icontains=search_query)
            )

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(designskus, request)
        serializer = DesignSkuSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class GroupCustomListAPIView(APIView):
    def get(self, request):
        group_customs = GroupCustom.objects.all().order_by("id")
        serializer = GroupCustomSerializer(group_customs, many=True)
        return Response(serializer.data)


class ShippingDoc(APIView):
    def post(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        access_token = shop.access_token
        data = json.loads(request.body.decode("utf-8"))
        doc_urls = []
        package_ids = data.get("package_ids", [])

        # Sử dụng ThreadPoolExecutor để thực hiện các cuộc gọi API đa luồng
        with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
            # Lặp qua từng package_id và gửi các công việc gọi API tới executor
            # để thực hiện đồng thời
            futures = []
            for package_id in package_ids:
                futures.append(
                    executor.submit(order.callGetShippingDoc, package_id=package_id, access_token=access_token)
                )

            # Thu thập kết quả từ các future và thêm vào danh sách doc_urls
            for future in futures:
                doc_url = future.result()
                doc_urls.append(doc_url)

        # Tạo phản hồi JSON chứa danh sách các URL của shipping doc
        response_data = {"code": 0, "data": {"doc_urls": doc_urls}}
        return JsonResponse(response_data)


class UploadDriver(APIView):
    def download_and_upload(self, order_document):
        order_id = order_document.get("package_id")
        doc_url = order_document.get("doc_url")
        print("order_id", order_id)
        print("doc_url", doc_url)

        if order_id and doc_url:
            try:
                # Download the file from doc_url
                response = requests.get(doc_url)
                if response.status_code == 200:
                    # Save the file with order_id as the name
                    file_name = f"{order_id}.pdf"
                    file_path = os.path.join(constant.PDF_DIRECTORY_WINDOW, file_name)
                    with open(file_path, "wb") as f:
                        f.write(response.content)
                        print(f"File saved: {file_path}")

            except Exception as e:
                print(f"Error downloading/uploading: {str(e)}")

    def post(self, request):
        try:
            data_post = json.loads(request.body.decode("utf-8"))
            order_documents = data_post.get("order_documents", [])

            with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
                # Sử dụng map để gọi download_and_upload cho mỗi order_document
                executor.map(self.download_and_upload, order_documents)

            return JsonResponse({"status": "success"}, status=201)

        except Exception as e:
            # Log the error
            print(f"Error in UploadDriver: {str(e)}")
            return JsonResponse({"status": "error", "message": str(e)}, status=500)


class ToShipOrderAPI(APIView):
    def get_order_detail(self, order_document) -> dict:
        order_list = order_document.get("order_list")
        doc_url = order_document.get("label")
        package_id = order_document.get("package_id")

        # Tải file PDF từ doc_url
        try:
            response = requests.get(doc_url)
        except Exception as e:
            logger.error("Error when downloading PDF file", exc_info=e)
            error_response = {
                "status": "error",
                "message": f"Có lỗi xảy ra khi tải file PDF label: {str(e)}",
                "data": None,
            }
            return error_response

        if response.status_code == 200:
            file_name = f"{package_id}.pdf"

            platform_name = platform.system()
            parent_dir = constant.PDF_DIRECTORY_WINDOW if platform_name == "Windows" else constant.PDF_DIRECTORY_UNIX
            os.makedirs(parent_dir, exist_ok=True)
            file_path = os.path.join(parent_dir, file_name)

            with open(file_path, "wb") as file:
                file.write(response.content)

            order_ids = [item.get("order_id") for item in order_list] if order_list else []

            # Call OrderDetail API
            try:
                order_details: dict = order.callOrderDetail(access_token=self.access_token, orderIds=order_ids).json()
            except Exception as e:
                logger.error("Error when calling OrderDetail API", exc_info=e)
                error_response = {"status": "error", "message": "Có lỗi xảy ra khi gọi API OrderDetail", "data": None}
                return error_response

            logger.info(f"OrderDetail response: {order_details}")

            # Check the response from TikTok API
            if order_details.get("data") is None:
                error_response = {
                    "status": "error",
                    "message": f'Có lỗi xảy ra khi gọi API OrderDetail: {order_details.get("message")}',
                    "data": None,
                }
                return error_response
            else:
                order_details["ocr_result"] = process_pdf_to_info(file_path)
                success_response = {"status": "success", "message": "Thành công", "data": order_details}

                return success_response
        else:
            error_response = {"status": "error", "message": "Có lỗi xảy ra khi tải file PDF", "data": response.text}
            return error_response

    def post(self, request, shop_id):
        data = []
        self.shop = get_object_or_404(Shop, id=shop_id)
        self.access_token = self.shop.access_token
        data_post = json.loads(request.body.decode("utf-8"))
        order_documents = data_post.get("order_documents", [])

        with ThreadPoolExecutor(max_workers=constant.MAX_WORKER) as executor:
            futures = []
            for order_document in order_documents:
                futures.append(executor.submit(self.get_order_detail, order_document))

            for future in futures:
                result = future.result()
                # logger.info(f'User {request.user}: Order detail and OCR label result: {result}')
                data.append(result)

        return JsonResponse(data, status=200, safe=False)


class PackageCreateForFlash(APIView):
    def post(self, request, shop_id, format=None):
        request.data["fulfillment_name"] = "FlashShip"
        request.data["shop"] = shop_id
        serializer = PackageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PackageCreateForPrint(APIView):
    def post(self, request, shop_id, format=None):
        request.data["fulfillment_name"] = "PrintCare"
        request.data["shop"] = shop_id
        serializer = PackageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PackageListByShop(APIView):
    def get(self, request, shop_id, format=None):
        packages = Package.objects.filter(shop_id=shop_id)

        # Kiểm tra nếu không có gói hàng nào được tìm thấy
        if not packages:
            return Response([], status=status.HTTP_200_OK)  # Trả về một mảng JSON rỗng

        serializer = PackageSerializer(packages, many=True)
        return Response(serializer.data)


class DeactivePack(APIView):
    # permission_classes = (IsAuthenticated,)

    def put(self, request, pack_id):
        package = get_object_or_404(Package, pack_id=pack_id)
        serializer = PackageDeactiveSerializer(package, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
