import json
import urllib.parse

import requests

from api.utils.tiktok_base_api import SIGN, TIKTOK_API_URL, app_key, logger, secret


def getAccessToken(auth_code: str) -> requests.Response:
    url = TIKTOK_API_URL["url_get_access_token"]

    body = json.dumps(
        {"app_key": app_key, "app_secret": secret, "auth_code": auth_code, "grant_type": "authorized_code"}
    )

    response = requests.post(url=url, json=json.loads(body))

    logger.info(f"Get access token status code: {response.status_code}")
    print(response)

    return response


def refreshToken(refresh_token: str) -> requests.Response:
    url = TIKTOK_API_URL["url_refresh_token"]

    body = json.dumps(
        {"app_key": app_key, "app_secret": secret, "refresh_token": refresh_token, "grant_type": "refresh_token"}
    )

    response = requests.post(url=url, json=json.loads(body))

    logger.info(f"Refresh token status code: {response.status_code}")

    return response


def get_author_shop(access_token: str) -> requests.Response:
    url = TIKTOK_API_URL["url_get_author_shop"]
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign

    response = requests.get(url, params=query_params)

    logger.info(f"Get brands status code: {response.status_code}")

    return response
