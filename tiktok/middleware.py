from django.http import JsonResponse


class BadRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, BadRequestException):
            return JsonResponse({
                "code": 400,
                "success": False,
                "message": str(exception)
            }, status=400)

class BadRequestException(Exception):
    pass
