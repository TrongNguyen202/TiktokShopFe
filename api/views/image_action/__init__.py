import json

from django.http import JsonResponse
from django.views import View

from api.utils.image_generation.replace_background import remove_background_and_paste


class ReplaceBackgroundView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            img_url = data.get("img_url")
            success, processed_image_base64 = remove_background_and_paste(img_url)
            if success:
                return JsonResponse({"output_image_base64": processed_image_base64})
            else:
                return JsonResponse({"error": "Failed to process image"}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
