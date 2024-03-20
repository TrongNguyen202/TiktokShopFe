import logging

from api import setup_logging
from api.utils.tiktok_base_api import token
from api.views import APIView, Response, get_object_or_404

from ....models import Shop

logger = logging.getLogger('api.views.token')
setup_logging(logger, is_root=False, level=logging.INFO)


class RefreshToken(APIView):
    """
        Refresh token của shop sau 7 ngày
    """

    def post(self, request, shop_id: int):
        shop = get_object_or_404(Shop, id=shop_id)

        # Call TikTok Shop API để refresh token của
        response = token.refreshToken(refresh_token=shop.refresh_token)
        json_data = response.json()
        data = json_data.get('data', {})

        # Lấy ra refresh token mới
        access_token = data.get('access_token', None)
        refresh_token = data.get('refresh_token', None)

        logger.info(f'Access token: {access_token}, Refresh token: {refresh_token}')

        # Update refresh token mới vào database
        shop.access_token = access_token
        shop.refresh_token = refresh_token
        shop.save()

        return Response(response)
