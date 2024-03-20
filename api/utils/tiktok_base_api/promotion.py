import asyncio
import json
import math
import urllib.parse
from datetime import datetime
from uuid import uuid4

import requests

from api.utils.tiktok_base_api import SIGN, TIKTOK_API_URL, app_key, logger, secret
from tiktok.middleware import BadRequestException

PROMOTION_SKUS_LIMIT = 3000

semaphore = asyncio.Semaphore(10)

async def limiter(func):
    async with semaphore:
        return await func()

async def get_active_products(access_token: str, page_number: int, page_size: int):
    """
    Get products
    """
    url = TIKTOK_API_URL["url_product_list"]

    query_params = {"app_key": app_key, "access_token": access_token, "timestamp": SIGN.get_timestamp()}

    body = json.dumps(
        {
            "page_size": page_size,
            "page_number": page_number,
            "search_status": 4,
        }
    )

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params, body=body)

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    data = response.json()
    if (data["code"] != 0):
        raise BadRequestException(data["message"])

    return data["data"]


async def get_all_no_promotion_products(access_token: str):
    """
    Get all no promotion products
    """
    start_page = 1
    end_page = 0
    page_size = 100

    first_page_data = await get_active_products(access_token, 1, 1)

    all_products = []
    total_count = first_page_data["total"]

    max_page = math.ceil(total_count / page_size)

    results = []
    if end_page <= 0:
        tasks = []
        for i in range(start_page, max_page + 1):
            tasks.append(limiter(lambda i=i: get_active_products(access_token, i, page_size)))

        results = await asyncio.gather(*tasks)

    else:
        tasks = []
        for i in range(start_page, end_page + 1):
            tasks.append(limiter(lambda i=i: get_active_products(access_token, i, page_size)))

        results = await asyncio.gather(*tasks)


    for result in results:
            all_products.extend(result["products"])

    # no_promotion_products = [product for product in all_products if not (product.get("promotion_infos") and len(product["promotion_infos"]) > 0)]

    return all_products


def get_promotions(access_token: str, status: int = None, page_number = 1, page_size = 100):
    """
    Get promotion campaigns
    """
    url = TIKTOK_API_URL["url_get_promotions"]

    if (page_number is None):
        page_number = 1

    if (page_size is None):
        page_size = 100


    query_params = {"app_key": app_key, "access_token": access_token, "timestamp": SIGN.get_timestamp()}

    body_json = {
        "page_number": page_number,
        "page_size": page_size,
    }

    if (status is not None):
        body_json["status"] = status

    body = json.dumps(body_json)

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params, body=body)

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    data = response.json()
    if (data["code"] != 0):
        raise BadRequestException(data["message"])

    return data["data"]

def get_promotion_detail(access_token: str, shop_id: str, promotion_id: str):
    """
    Get promotion detail
    """
    url = TIKTOK_API_URL["url_get_promotion_detail"]

    query_params = {"app_key": app_key, "access_token": access_token, "timestamp": SIGN.get_timestamp()}
    # query_params["shop_id"] = shop_id
    query_params["promotion_id"] = promotion_id

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params)

    query_params["sign"] = sign

    response = requests.get(url=url, params=query_params)

    data = response.json()
    if (data["code"] != 0):
        raise BadRequestException(data["message"])

    return data

async def create_simple_promotion(access_token: str, title: str, begin_time: int, end_time: int, type: str, product_type="SKU"):
    """
    Create simple promotion - flash sale or product discount
    """
    url = TIKTOK_API_URL["url_create_promotion"]

    query_params = {"app_key": app_key, "access_token": access_token, "timestamp": SIGN.get_timestamp()}

    now = datetime.now()

    formatted_date = now.strftime("%y-%m-%d--%H-%M-%S")
    body_json = {
        "begin_time": begin_time,
        "end_time": end_time,
        "product_type": 2 if product_type == "SKU" else 1,  # SPU
        "promotion_type": 3 if type == "FlashSale" else 2 if type == "DirectDiscount" else 1,  # FixedPrice
        "request_serial_no": "create" + str(uuid4()),
        "title": title + "-" + formatted_date,
    }

    body = json.dumps(body_json)

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params, body=body)

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    data = response.json()
    if (data["code"] != 0):
        raise BadRequestException(data["message"])

    return data["data"]


async def create_promotion_with_products(access_token: str, title: str, begin_time: int, end_time: str, type: str, discount: int, product_type: str, products = []):
    """
    Create promotion with products
    """
    new_promotion = await create_simple_promotion(access_token=access_token, title=title, begin_time=begin_time, end_time=end_time, type=type, product_type=product_type)  # noqa: E501

    promotion_id = new_promotion["promotion_id"]
    logger.info("Promotion created successfully  - " + promotion_id)

    product_list = []
    for product in products:
        sku_list = []
        for sku in product["skus"]:
            skuData = {
                    # "discount": discount,
                    "num_limit": -1,
                    "user_limit": -1,
                    "product_id": product["id"],
                    # "promotion_price": round(float(sku["price"]["original_price"]) * (100 - discount) / 100, 2),
                    "sku_id": sku["id"],
                }
            if (type == 'FlashSale' or type == 'FixedPrice'):
                skuData["promotion_price"] = round(float(sku["price"]["original_price"]) * (100 - discount) / 100, 2)
            else :
                skuData["discount"] = discount

            sku_list.append(
               skuData
            )

        product_list.append(
            {
                # "discount": discount,
                # "promotion_price":round(float(product["skus"][0]["price"]["original_price"]) * (100 - discount) / 100, 2),
                "num_limit": -1,
                "user_limit": -1,
                "product_id": product["id"],
                "sku_list": sku_list,
            }
        )

    add_or_update_promotion(access_token, promotion_id, product_list)

    return promotion_id


async def create_promotion(access_token: str, title: str, begin_time: int, end_time: int, type: str, discount: int, product_type="SKU"):
    """
    Create advanced promotion - deactivated all promotions before and create new one
    """
    all_products = await get_all_no_promotion_products(access_token)

    # new_promotion = await create_simple_promotion(access_token=access_token, title=title, begin_time=begin_time, end_time=end_time, type=type, discount=discount, product_type=product_type)  # noqa: E501

    # Separate all_products into products_pack
    products_pack = []
    pack = []
    pack_sku_count = 0

    for product in all_products:
        sku_count = len(product["skus"])
        if pack_sku_count + sku_count <= PROMOTION_SKUS_LIMIT:
            pack.append(product)
            pack_sku_count += sku_count
        else:
            products_pack.append(pack)
            pack = [product]
            pack_sku_count = sku_count

    if pack:  # Add the last pack if any remaining
        products_pack.append(pack)

    deactivate_all_promotions(access_token)

    promotion_ids = []
    for pack in products_pack:
        promotion_id = await create_promotion_with_products(access_token=access_token, title=title, begin_time=begin_time, end_time=end_time, type=type, discount=discount, product_type=product_type, products=pack)  # noqa: E501
        print(promotion_id)
        promotion_ids.append(promotion_id)

    return {"data": {
        "promotion_ids": promotion_ids,
        "count": len(promotion_ids),
        "products_count": len(all_products),
        "skus_count": sum([len(product["skus"]) for product in all_products]),
    }}

def add_or_update_promotion(access_token: str, promotion_id: int, product_list: list):
    """
    Add or update skus for promotion
    """
    url = TIKTOK_API_URL["url_add_or_update_promotion"]

    query_params = {"app_key": app_key, "access_token": access_token, "timestamp": SIGN.get_timestamp()}

    body_json = {
        "product_list": product_list,
        "promotion_id": promotion_id,
        "request_serial_no": "update_promo" + str(uuid4()),
    }

    body = json.dumps(body_json)

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params, body=body)

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    data = response.json()
    if (data["code"] != 0):
        raise BadRequestException(data["message"])

    return data["data"]

def deactivate_promotion(access_token: str, promotion_id: int):
    """
    Deactivate promotion
    """
    url = TIKTOK_API_URL["url_deactivate_promotion"]

    query_params = {"app_key": app_key, "access_token": access_token, "timestamp": SIGN.get_timestamp()}

    body_json = {
        "promotion_id": promotion_id,
        "request_serial_no": "deactivate_promo" + str(uuid4()),
    }

    body = json.dumps(body_json)

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params, body=body)

    query_params["sign"] = sign

    response = requests.post(url=url, params=query_params, json=json.loads(body))

    data = response.json()
    if (data["code"] != 0):
        raise BadRequestException(data["message"])

    logger.info("Promotion deactivated " + str(promotion_id))

    return data["data"]

def deactivate_all_promotions(access_token: str):
    """
    Deactivate all promotions
    """
    active_promotions = get_promotions(access_token, 2)["promotion_list"]

    for promotion in active_promotions:
        deactivate_promotion(access_token, promotion["promotion_id"])

    return True
