from api.utils.tiktok_base_api import *


def getAccessToken(auth_code: str) -> requests.Response:
    url = TIKTOK_API_URL['url_get_access_token']

    body = json.dumps({
        'app_key': app_key,
        'app_secret': secret,
        'auth_code': auth_code,
        'grant_type': 'authorized_code'
    })

    resposne = requests.post(
        url=url,
        json=json.loads(body)
    )

    logger.info(f'Get access token status code: {resposne.status_code}')

    return resposne


def refreshToken(refresh_token: str) -> requests.Response:
    url = TIKTOK_API_URL['url_refresh_token']

    body = json.dumps({
        'app_key': app_key,
        'app_secret': secret,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
    })

    response = requests.post(
        url=url,
        json=json.loads(body)
    )

    logger.info(f'Refresh token status code: {response.status_code}')

    return response
