from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import ImageFolder, Image
from api.serializers import ImageFolderSerializer, NestedImageFolderSerializer
from  django.http import Http404
from rest_framework.permissions import IsAuthenticated as IsAuthenticated


class ImageFolderListCreateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user = request.user
        folders = ImageFolder.objects.filter(user = user)
        serializer = ImageFolderSerializer(folders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ImageFolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageFolderRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk):
        try:
            return ImageFolder.objects.get(pk=pk)
        except ImageFolder.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        folder = self.get_object(pk)
        serializer = ImageFolderSerializer(folder)
        return Response(serializer.data)

    def put(self, request, pk):
        folder = self.get_object(pk)
        serializer = ImageFolderSerializer(folder, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        folder = self.get_object(pk)
        folder.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

