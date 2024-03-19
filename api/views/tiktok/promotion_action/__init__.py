from asgiref.sync import async_to_sync
from django.http import JsonResponse

from api.views import *

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

        data = promotion.get_promotions(access_token=shop.access_token, status=status, page_number=page_number, page_size=page_size)

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
    def post(self, request, shop_id: str):
        shop = get_object_or_404(Shop, id=shop_id)
        body_raw = request.body.decode("utf-8")
        promotion_data = json.loads(body_raw)

        data = promotion.add_or_update_promotion(access_token=shop.access_token, **promotion_data)

        return JsonResponse(data)
