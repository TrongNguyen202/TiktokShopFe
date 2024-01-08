from .constant import secret, TIKTOK_API_URL, app_key, grant_type
from api.helpers import GenerateSign, GenerateSignNoBody
import requests
import json
import urllib.parse

SIGN = GenerateSign()
SIGNNOBODY = GenerateSignNoBody()


def callProductList(access_token):
    url = TIKTOK_API_URL['url_product_list']
    query_params = {
        "app_key": "6atknvel13hna",
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp()
    }
    body = json.dumps({
        "page_size": 50,
        "page_number": 1,
        "search_status": 0,
        "seller_sku_list": []
    })

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    # Process the response
    print(response.status_code)
    print(response.text)
    return response


def getAccessToken(auth_code):
    url = TIKTOK_API_URL['url_get_access_token']

    body = json.dumps({

        "app_key": "6atknvel13hna",
        "app_secret": "df329e59a6f78121409d77c33ee1decfbfa088a4",
        "grant_type": "authorized_code",
        "auth_code": auth_code,
    })

    response = requests.post(url, json=json.loads(body))
    print(response.status_code)
    print(response.text)
    return response


def refreshToken(refreshToken):
    url = TIKTOK_API_URL['url_refresh_token']
    body = json.dumps({

        "app_key": app_key,
        "app_secret": secret,
        "refresh_token": refreshToken,
        "grant_type": grant_type,
    })
    response = requests.post(url, json=json.loads(body))
    print(response.status_code)
    print(response.text)
    return response


def callProductDetail(access_token, product_id):
    url = TIKTOK_API_URL['url_detail_product']
    query_params = {
        "app_key": "6atknvel13hna",
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "product_id": product_id,
    }

    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    # Process the response
    print(response.status_code)
    print(response.text)
    return response


# def getActiveShop(access_token):
#     url = TIKTOK_API_URL['url_get_active_shop']
#     query_params = {
#         "app_key": "6atknvel13hna",
#         "access_token": access_token,
#         "timestamp": SIGN.get_timestamp()
#     }


#     sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params )
#     query_params["sign"] = sign

#     response = requests.post(url, params=query_params)

#     # Process the response
#     print(response.status_code)
#     print(response.text)
#     return response

def getCategories(access_token):
    url = TIKTOK_API_URL['url_get_categories']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGNNOBODY.get_timestamp(),

    }

    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    # Process the response

    return response


def getWareHouseList(access_token):
    url = TIKTOK_API_URL['url_get_warehouse']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGNNOBODY.get_timestamp(),

    }

    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    # Process the response

    return response


def callUploadImage(access_token, img_data):
    url = TIKTOK_API_URL['url_upload_image']
    query_params = {
        "app_key": "6atknvel13hna",
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),

    }
    body = json.dumps({
        "img_data": img_data,
        "img_scene": 1

    })

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.post(url, params=query_params, json=json.loads(body))

    # Process the response
    print(response.status_code)
    print(response.text)
    return response
