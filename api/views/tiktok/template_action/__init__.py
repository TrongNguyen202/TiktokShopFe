import logging

from api import setup_logging
from api.views import APIView, IsAuthenticated, Response, csrf_exempt, get_object_or_404, method_decorator, status

from ....models import Templates
from ....serializers import TemplatePutSerializer, TemplateSerializer

logger = logging.getLogger('api.views.tiktok.template')
setup_logging(logger, is_root=False, level=logging.INFO)


@method_decorator(csrf_exempt, name='dispatch')
class TemplateList(APIView):  # đổi tên thành TemplateList
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = self.request.user
        templates = Templates.objects.filter(user=user)
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data)

    def post(self, request):
        template = Templates.objects.create(
            name=request.data.get('name'),
            category_id=request.data.get('category_id'),
            description=request.data.get('description'),
            is_cod_open=request.data.get('is_cod_open'),
            package_height=request.data.get('package_height'),
            package_length=request.data.get('package_length'),
            package_weight=request.data.get('package_weight'),
            package_width=request.data.get('package_width'),
            sizes=request.data.get('sizes'),
            colors=request.data.get('colors'),
            type=request.data.get('type'),
            types=request.data.get('types'),
            user=self.request.user,
            badWords=request.data.get('badWords'),
            suffixTitle=request.data.get('suffixTitle'),
            size_chart=request.data.get('size_chart', ''),
            fixed_images=request.data.get('fixed_images', [])
        )
        template.save()
        return Response({'message': 'Template created successfully'}, status=status.HTTP_201_CREATED)

    def put(self, request, template_id):
        template = get_object_or_404(Templates, id=template_id)
        if request.data.get('suffixTitle', '') == "":
            request.data['suffixTitle'] = None
        if request.data.get('badWords', []) == []:
            request.data['badWords'] = None
        if request.data.get('size_chart', "") == "":
            request.data['size_chart'] = None
        if request.data.get('fixed_images', []) == []:
            request.data['fixed_images'] = None

        template_serializer = TemplatePutSerializer(template, data=request.data)
        if template_serializer.is_valid():
            template_serializer.save()
            return Response(template_serializer.data, status=200)
        else:
            return Response(template_serializer.errors, status=400)

    def delete(self, request, template_id):
        template = get_object_or_404(Templates, id=template_id)
        try:
            template.delete()
            return Response({'message': 'Template deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error('Failed to delete template', exc_info=e)
            return Response(
                {
                    'status': 'error',
                    'message': f'Có lỗi xảy ra khi xóa template: {str(e)}',
                    'detail': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
