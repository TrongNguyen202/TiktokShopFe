import json

import requests

from api.utils.tiktok_base_api import TIKTOK_API_URL, app_key, logger, secret


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
