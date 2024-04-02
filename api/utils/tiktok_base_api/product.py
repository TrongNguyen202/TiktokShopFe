import json
import logging
import urllib.parse

import requests

from api.utils.tiktok_base_api import (
    SIGN,
    TIKTOK_API_URL,
    app_key,
    logger,
    secret,
)
from api.views import HttpResponse


# Liệt kê danh sách sản phẩm của shop
def callProductList(access_token: str, page_number: str) -> requests.Response:
    url = TIKTOK_API_URL["url_product_list"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    body = json.dumps(
        {
            "page_size": 100,
            "page_number": str(page_number),
            "search_status": 0,
            "seller_sku_list": [],
        }
    )

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
        body=body,
    )

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    logger.info(f"Get product list status code: {response.status_code}")
    # logger.info(f'Get product list response: {response.text}')
    print("resssss", response.text)

    return response


# Lấy thông tin chi tiết sản phẩm
def callProductDetail(access_token: str, product_id: int) -> requests.Response:
    url = TIKTOK_API_URL["url_detail_product"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "product_id": product_id,
    }

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
    )

    query_params["sign"] = sign

    response = requests.get(url=url, params=query_params)

    logger.info(f"Get product detail status code: {response.status_code}")
    # logger.info(f'Get product detail response: {response.text}')

    return response


# Lấy danh sách danh mục toàn cầu
def callGlobalCategories(access_token: str) -> requests.Response:
    url = TIKTOK_API_URL["url_global_categories"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
    )

    query_params["sign"] = sign

    response = requests.get(url=url, params=query_params)

    logger.info(f"Get global categories status code: {response.status_code}")
    # logger.info(f'Get global categories response: {response.text}')

    return response


# Lấy danh sách danh mục của shop
def getCategories(access_token: str) -> requests.Response:
    url = TIKTOK_API_URL["url_get_categories"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
    )

    query_params["sign"] = sign

    response = requests.get(url=url, params=query_params)

    logger.info(f"Get categories status code: {response.status_code}")
    # logger.info(f'Get categories response: {response.text}')

    return response


def getWareHouseList(access_token: str) -> requests.Response:
    url = TIKTOK_API_URL["url_get_warehouse"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
    )

    query_params["sign"] = sign

    response = requests.get(url=url, params=query_params)

    logger.info(f"Get warehouse list status code: {response.status_code}")
    # logger.info(f'Get warehouse list response: {response.text}')

    return response


def getBrands(access_token: str) -> requests.Response:
    url = TIKTOK_API_URL["url_get_brands"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    logger.info(f"Get brands status code: {response.status_code}")
    # logger.info(f'Get brands response: {response.text}')

    return response


def getAttributes(access_token: str, category_id: str) -> requests.Response:
    url = TIKTOK_API_URL["url_get_attributes"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "category_id": category_id,
    }

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    logger.info(f"Get attributes status code: {response.status_code}")
    # logger.info(f'Get attributes response: {response.text}')

    return response


def createProduct(access_token, title, images_ids, product_object):
    url = TIKTOK_API_URL["url_create_product"]
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }
    if product_object.size_chart is None:
        product_object.size_chart = ""

    images_list = [{"id": image_id} for image_id in images_ids]
    skus_list = []
    for sku in product_object.skus:
        sales_attributes_list = [
            {
                "attribute_id": attr.attribute_id,
                "attribute_name": attr.attribute_name,
                "custom_value": attr.custom_value,
            }
            for attr in sku.sales_attributes
        ]
        stock_infos_list = [
            {
                "warehouse_id": info.warehouse_id,
                "available_stock": info.available_stock,
            }
            for info in sku.stock_infos
        ]
        skus_list.append(
            {
                "sales_attributes": sales_attributes_list,
                "original_price": sku.original_price,
                "stock_infos": stock_infos_list,
                "seller_sku": sku.seller_sku,
            }
        )

    bodyjson = {
        "product_name": title,
        "images": images_list,
        "is_cod_open": product_object.is_cod_open,
        "package_dimension_unit": "imperial",
        "package_height": product_object.package_height,
        "package_length": product_object.package_length,
        "package_weight": product_object.package_weight,
        "package_width": product_object.package_width,
        "category_id": product_object.category_id,
        "description": product_object.description or "",
        "skus": skus_list,
    }
    if product_object.size_chart != "" and product_object.size_chart is not None:
        size_chart_id = callUploadImage(access_token=access_token, img_data=product_object.size_chart)
        bodyjson["size_chart"] = {"img_id": size_chart_id}

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    return response


def callCreateOneProduct(access_token: str, product_object) -> requests.Response:
    """
    Use with create one product (With form)
    """
    url = TIKTOK_API_URL["url_create_product"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    skus_list = []

    for sku in product_object.skus:
        sales_attributes_list = [
            {
                "attribute_id": attr.attribute_id,
                "attribute_name": attr.attribute_name,
                "custom_value": attr.custom_value,
            }
            for attr in sku.sales_attributes
        ]

        stock_infos_list = [
            {
                "warehouse_id": info.warehouse_id,
                "available_stock": info.available_stock,
            }
            for info in sku.stock_infos
        ]

        skus_list.append(
            {
                "sales_attributes": sales_attributes_list,
                "original_price": sku.original_price,
                "stock_infos": stock_infos_list,
            }
        )

        product_attributes_list = []

        for attribute in product_object.product_attributes:
            attribute_values_list = [
                {"value_id": value.value_id, "value_name": value.value_name} for value in attribute.attribute_values
            ]

            product_attributes_list.append(
                {
                    "attribute_id": attribute.attribute_id,
                    "attribute_values": attribute_values_list,
                }
            )

    body_json = {
        "product_name": product_object.product_name,
        "images": [{"id": image_id} for image_id in product_object.images],
        "is_cod_open": product_object.is_cod_open,
        "package_dimension_unit": product_object.package_dimension_unit,
        "package_height": product_object.package_height,
        "package_length": product_object.package_length,
        "package_weight": product_object.package_weight,
        "package_width": product_object.package_width,
        "category_id": product_object.category_id,
        "description": product_object.description or "",
        "skus": skus_list,
        "product_attributes": product_attributes_list,
    }

    if product_object.brand_id != "":
        body_json["brand_id"] = product_object.brand_id

    body = json.dumps(body_json)

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
        body=body,
    )

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    logger.info(f"Create product status code: {response.status_code}")
    # logger.info(f'Create product response: {response.text}')

    return response


def callUploadImage(access_token: str, img_data: str, return_id: bool = True) -> requests.Response | str:
    url = TIKTOK_API_URL["url_upload_image"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    body = json.dumps({"img_data": img_data, "img_scene": 1})

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
        body=body,
    )

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    if return_id:
        response_data = response.json()
        if "data" in response_data and "img_id" in response_data["data"]:
            image_id = response_data["data"]["img_id"]
            return image_id

    return response


def callEditProduct(access_token, product_object, imgBase64) -> requests.Response:
    url = TIKTOK_API_URL["url_edit_product"]
    images_list = [image for image in product_object.images]
    if imgBase64:
        for item in imgBase64:
            response = callUploadImage(access_token=access_token, img_data=item)

            images_list.append({"id": response})

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    skus_list = []
    for sku in product_object.skus:
        sales_attributes_list = [
            {
                "attribute_id": attr.attribute_id,
                "attribute_name": attr.attribute_name,
                "value_id": attr.value_id,
                "value_name": attr.value_name,
            }
            for attr in sku.sales_attributes
        ]
        stock_infos_list = [
            {
                "warehouse_id": info.warehouse_id,
                "available_stock": info.available_stock,
            }
            for info in sku.stock_infos
        ]
        skus_list.append(
            {
                "sales_attributes": sales_attributes_list,
                "original_price": sku.original_price,
                "stock_infos": stock_infos_list,
            }
        )

    product_attributes_list = []
    for attribute in product_object.product_attributes:
        attribute_values_list = [
            {"value_id": value.value_id, "value_name": value.value_name} for value in attribute.attribute_values
        ]
        product_attributes_list.append(
            {
                "attribute_id": attribute.attribute_id,
                "attribute_values": attribute_values_list,
            }
        )

    bodyjson = {
        "product_id": product_object.product_id,
        "product_name": product_object.product_name,
        "images": images_list,
        "is_cod_open": True,
        "price": product_object.price,
        "package_dimension_unit": product_object.package_dimension_unit,
        "package_height": product_object.package_height,
        "package_length": product_object.package_length,
        "package_weight": product_object.package_weight,
        "package_width": product_object.package_width,
        "category_id": product_object.category_id,
        "description": product_object.description,
        "skus": skus_list,
        "product_attributes": product_attributes_list,
    }
    if product_object.brand_id != "":
        bodyjson["brand_id"] = product_object.brand_id

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.put(url, params=query_params, json=json.loads(body))
    return response


def callGetAttribute(access_token, category_id):
    url = TIKTOK_API_URL["url_get_product_attritrute"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "category_id": category_id,
    }

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
    )

    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    try:
        response_data = response.json()
        return response_data
    except Exception as e:
        logging.error("Error when get attribute", exc_info=e)
        return None


def callCreateOneProductDraf(access_token, product_object):
    url = TIKTOK_API_URL["url_create_draf_product"]

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    skus_list = []

    for sku in product_object.skus:
        sales_attributes_list = [
            {
                "attribute_id": attr.attribute_id,
                "attribute_name": attr.attribute_name,
                "custom_value": attr.custom_value,
            }
            for attr in sku.sales_attributes
        ]

        stock_infos_list = [
            {
                "warehouse_id": info.warehouse_id,
                "available_stock": info.available_stock,
            }
            for info in sku.stock_infos
        ]

        skus_list.append(
            {
                "sales_attributes": sales_attributes_list,
                "original_price": sku.original_price,
                "stock_infos": stock_infos_list,
            }
        )

        product_attributes_list = []

        for attribute in product_object.product_attributes:
            attribute_values_list = [
                {"value_id": value.value_id, "value_name": value.value_name} for value in attribute.attribute_values
            ]

            product_attributes_list.append(
                {
                    "attribute_id": attribute.attribute_id,
                    "attribute_values": attribute_values_list,
                }
            )

    bodyjson = {
        "product_name": product_object.product_name,
        "images": [{"id": image_id} for image_id in product_object.images],
        "is_cod_open": product_object.is_cod_open,
        "package_dimension_unit": product_object.package_dimension_unit,
        "package_height": product_object.package_height,
        "package_length": product_object.package_length,
        "package_weight": product_object.package_weight,
        "package_width": product_object.package_width,
        "category_id": product_object.category_id,
        "description": product_object.description or "",
        "skus": skus_list,
        "product_attributes": product_attributes_list,
    }

    if product_object.brand_id != "":
        bodyjson["brand_id"] = product_object.brand_id

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    logger.info(f"Create product draf response: {response.text}")

    return HttpResponse(response)


def categoryRecommend(access_token, product_title):
    url = TIKTOK_API_URL["url_get_category_recommend"]
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    bodyjson = {"product_name": product_title}

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    logger.info(f"Category recommend response: {response.text}")

    return HttpResponse(response)
