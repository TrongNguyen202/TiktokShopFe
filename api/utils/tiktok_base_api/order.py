import json
import urllib.parse

import requests

from api.utils.tiktok_base_api import SIGN, TIKTOK_API_URL, app_key, logger, secret
from api.views import HttpResponse


def callOrderList(access_token: str):
    url = TIKTOK_API_URL['url_get_orders']

    query_params = {
        'app_key': app_key,
        'access_token': access_token,
        'timestamp': SIGN.get_timestamp(),
    }

    body = json.dumps({
        'page_size': 100
    })

    sign = SIGN.cal_sign(secret=secret, url=urllib.parse.urlparse(url), query_params=query_params, body=body)
    query_params['sign'] = sign
    response = requests.post(url, params=query_params, json=json.loads(body))

    return response


def callOrderDetail(access_token, orderIds):
    url = TIKTOK_API_URL['url_get_order_detail']

    query_params = {
        'app_key': app_key,
        'access_token': access_token,
        'timestamp': SIGN.get_timestamp(),
    }

    body = json.dumps({
        "order_id_list": orderIds,
        "page_size": 50,
    })

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params,
        body=body
    )

    query_params['sign'] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    return response


def callGetShippingDocument(access_token, order_id):
    url = TIKTOK_API_URL['url_get_shipping_document']

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "order_id": order_id,
        "document_type": "SHIPPING_LABEL",
        "document_size": "A6"
    }

    # body = json.dumps({
    #     "order_id": order_id
    # })

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params
    )

    query_params['sign'] = sign

    response = requests.get(url, params=query_params)

    try:
        response_data = response.json()
        doc_url = response_data['data']['doc_url']

        if doc_url:
            return doc_url
        else:
            logger.warning(f'No shipping label for order {order_id}')
            return None
    except Exception as e:
        logger.error(f'Error when getting shipping label for order {order_id}', exc_info=e)
        return None


def callPreCombinePackage(access_token):
    url = TIKTOK_API_URL['url_pre_combine_package']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "page_size": 10

    }
    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params
    )
    query_params['sign'] = sign

    response = requests.get(url, params=query_params)

    logger.info(f'PreCombinePackage response: {response.text}')

    return HttpResponse(response)


def callConFirmCombinePackage(access_token, body_raw_json):
    url = TIKTOK_API_URL['url_confirm_combine_package']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    bodyjson = body_raw_json
    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    logger.info(f'ConfirmCombinePackage response: {response.text}')

    return HttpResponse(response)


def callGetShippingService(access_token, body_raw_json):
    url = TIKTOK_API_URL['url_get_shipping_service']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    bodyjson = body_raw_json
    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    logger.info(f'GetShippingService response: {response.text}')

    return HttpResponse(response)


def callSearchPackage(access_token):
    url = TIKTOK_API_URL['url_search_package']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    bodyjson = {
        "page_size": 10000
    }

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    logger.info(f'SearchPackage response: {response.text}')

    return HttpResponse(response)


def callGetPackageDetail(access_token, package_id):
    url = TIKTOK_API_URL['url_get_package_detail']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "package_id": package_id

    }

    sign = SIGN.cal_sign(
        secret=secret,
        url=urllib.parse.urlparse(url),
        query_params=query_params
    )
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    # logger.info(f'GetPackageDetail response: {response.text}')

    return HttpResponse(response)


def callCreateLabel(access_token, body_raw_json):
    url = TIKTOK_API_URL['url_create_label']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    bodyjson = body_raw_json
    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body=body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    return HttpResponse(response)


def callGetShippingDoc(access_token,  package_id):
    url = TIKTOK_API_URL['url_get_shipping_doc']

    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "package_id": package_id,
        "document_type": 1,
        "document_size": 0
    }

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    try:
        response_data = response.json()
        doc_url = response_data["data"]["doc_url"]

        if doc_url:
            return doc_url
        else:
            logger.warning(f"No shipping label for package {package_id}")
            return None
    except Exception as e:
        logger.error(f"Error when getting shipping label for package {package_id}", exc_info=e)
        return None
