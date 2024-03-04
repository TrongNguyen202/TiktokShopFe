from ....serializers import TemplatesSerializers
from ....models import Templates
from api.views import *

logger = logging.getLogger('api.views.tiktok.template')
setup_logging(logger, is_root=False, level=logging.INFO)


class TemplateList(APIView):
    permission_classes = (IsAuthenticated, )  # Chỉ cho phép người dùng đã đăng nhập truy cập

    def get(self, request):
        user = self.request.user
        templates = Templates.objects.filter(user=user)
        serializer = TemplatesSerializers(templates, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
            Tạo một template mới
        """
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
        )

        template.save()
        return Response({'message': 'Template created successfully'}, status=status.HTTP_201_CREATED)

    def put(self, request, template_id):
        template = get_object_or_404(Templates, id=template_id)

        template_serializer = TemplatesSerializers(template, data=request.data)
        if template_serializer.is_valid():
            template_serializer.save()
            return Response(template_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(template_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, template_id):
        template = get_object_or_404(Templates, id=template_id)

        try:
            template.delete()
            return Response({'message': 'Template deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': f'Failed to delete template: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
