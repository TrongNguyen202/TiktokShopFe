import json
import logging

from asgiref.sync import async_to_sync

from api import setup_logging
from api.utils.tiktok_base_api import promotion
from api.views import APIView, JsonResponse, get_object_or_404

from ....models import Shop

logger = logging.getLogger("api.views.tiktok.product")
setup_logging(logger, is_root=False, level=logging.INFO)

"""Promotion"""


class GetPromotionsView(APIView):
    def get(self, request, shop_id: str):
        shop = get_object_or_404(Shop, id=shop_id)
        status = request.GET.get("status")
        page_number = request.GET.get("page_number")
        page_size = request.GET.get("page_size")
        title = request.GET.get("title")

        data = promotion.get_promotions(access_token=shop.access_token, status=status, page_number=page_number, title=title, page_size=page_size)

        return JsonResponse(data)


class GetPromotionDetailView(APIView):
    def get(self, request, shop_id: int, promotion_id: int):
        shop = get_object_or_404(Shop, id=shop_id)

        data = promotion.get_promotion_detail(access_token=shop.access_token, shop_id=str(shop_id), promotion_id=str(promotion_id))

        return JsonResponse(data)


class CreatePromotionView(APIView):
    def post(self, request, shop_id: str):
        shop = get_object_or_404(Shop, id=shop_id)
        body_raw = request.body.decode("utf-8")
        promotion_data = json.loads(body_raw)

        data = async_to_sync(promotion.create_promotion)(access_token=shop.access_token, **promotion_data)

        return JsonResponse(data)


class AddOrUpdatePromotionView(APIView):
    def patch(self, request, shop_id: str):
        shop = get_object_or_404(Shop, id=shop_id)
        body_raw = request.body.decode("utf-8")
        promotion_data = json.loads(body_raw)

        data = promotion.add_or_update_promotion(access_token=shop.access_token, **promotion_data)

        return JsonResponse(data)
