import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import FlashShipPODVariantList

from ...serializers import FlashShipPODVariantListSerializer


class SaveVariantDataFromExcel(APIView):
    def post(self, request):
        excel_file = request.FILES.get("excel_file")

        if not excel_file:
            return Response(
                {"message": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            df = pd.read_excel(excel_file)

            for index, row in df.iterrows():
                variant_id = row["variant_id"]
                variant_sku = row["variant_sku"]
                product_type = row["product_type"]

                try:
                    size, color = variant_sku.split("/")
                except ValueError:
                    return Response(
                        {"message": f"Invalid variant SKU at row {index+1}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if product_type not in [choice[0] for choice in FlashShipPODVariantList.PRODUCT_TYPE_CHOICES]:
                    return Response(
                        {"message": f"Invalid product type at row {index+1}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                FlashShipPODVariantList.objects.create(
                    variant_id=variant_id,
                    color=color,
                    size=size,
                    product_type=product_type,
                )

            return Response(
                {"message": "Variant data saved successfully"},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"message": f"Failed to save variant data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class FlashShipPODVariantListView(APIView):
    def get(self, request):
        variants = FlashShipPODVariantList.objects.all()
        serializer = FlashShipPODVariantListSerializer(variants, many=True)
        return Response(serializer.data)
