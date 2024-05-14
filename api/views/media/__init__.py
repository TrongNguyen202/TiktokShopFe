from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import ImageFolder, Image
from api.serializers import ImageFolderSerializer, NestedImageFolderSerializer
from  django.http import Http404
from rest_framework.permissions import IsAuthenticated as IsAuthenticated
import json
from concurrent.futures import ThreadPoolExecutor
from api.utils.tiktok_base_api import product
from api.models import Shop, Image
from django.http import JsonResponse as JsonResponse
from django.core.paginator import Paginator
#parent folder
class ImageFolderListCreateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    #get all folder parent
    def get(self, request):
        user = request.user
        folders = ImageFolder.objects.filter(
            user=user, parent=None)  
        serializer = ImageFolderSerializer(
            folders, many=True)
        return Response(serializer.data)

   
    #post folder parent
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
   
        serializer = ImageFolderSerializer(data=data)
     
        if serializer.is_valid():
            user = request.user
            name = data.get("name")
            new_folder = ImageFolder.objects.create(user=user, name=name)
            return Response(ImageFolderSerializer(new_folder).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubfoldersListAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, id):
        user = request.user
        try:
            parent_folder = ImageFolder.objects.get(id=id, user=user)
        except ImageFolder.DoesNotExist:
            return Response({"error": "Parent folder does not exist"}, status=status.HTTP_404_NOT_FOUND)

        subfolders = parent_folder.children.all()
        serializer = ImageFolderSerializer(subfolders, many=True)
        return Response(serializer.data)

    def post(self, request, id):
        user = request.user
        data = json.loads(request.body.decode("utf-8"))
        try:
            parent_folder = ImageFolder.objects.get(id=id, user=user)
        except ImageFolder.DoesNotExist:
            return Response({"error": "Parent folder does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ImageFolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, parent=parent_folder, name=data.get("name"))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageFolderRetrieveUpdateDestroyAPIView(APIView):
    permission_classes = (IsAuthenticated,)
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

class UploadImageIntoFolder(APIView):
    permission_classes = (IsAuthenticated,)

    def upload_images(self, image_datas, access_token):
        images_info = []

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(
                product.callUploadImage, access_token, img_data['base_64']) for img_data in image_datas]

            for idx, future in enumerate(futures):
                img_id = future.result()
         
                if img_id:
                    images_info.append({
                        'name': image_datas[idx]['name'],
                        'img_id': img_id
                    })

        return images_info

    def post(self, request, folder_id):
        shop = Shop.objects.get(shop_name__icontains="mediaseller")
        if not shop:
            return JsonResponse({"message": "Shop not found"}, status=status.HTTP_404_NOT_FOUND)

        data = json.loads(request.body.decode("utf-8"))
        image_datas = data.get("image_data")

        if not folder_id:
            return JsonResponse({"message": "Folder ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            folder = ImageFolder.objects.get(id=folder_id)
        except ImageFolder.DoesNotExist:
            return JsonResponse({"message": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

        access_token = shop.access_token
        after_image_data = self.upload_images(
            image_datas=image_datas, access_token=access_token)

        for image_res in after_image_data:
            image_res["img_id"] = f"https://p16-oec-ttp.tiktokcdn-us.com/{image_res['img_id']}~tplv-omjb5zjo8w-origin-jpeg.jpeg"
          

        if folder:
            for data in after_image_data:
                image_create = Image.objects.create(
                    image_url=data["img_id"], image_name=data["name"], folder=folder)

        response = {"images": after_image_data, "message": "success"}
        return JsonResponse(response)
        

class GetImageAndSubFolder(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, id):
        user = request.user
        try:
            parent_folder = ImageFolder.objects.get(id=id, user=user)
        except ImageFolder.DoesNotExist:
            return Response({"error": "Parent folder does not exist"}, status=status.HTTP_404_NOT_FOUND)

        images = Image.objects.filter(
            folder=parent_folder).order_by('-created_at')

        # Phân trang
        paginator = Paginator(images, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        serialized_images = [
            {"id": image.id, "image_url": image.image_url,
                "image_name": image.image_name}
            for image in page_obj
        ]
        next_page = page_obj.number + 1 if page_obj.has_next() else None
        if request.GET.get('page') and int(request.GET.get('page')) > paginator.num_pages:
            return Response({"error": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)
        response = {
            "data": {
                "images": serialized_images,
                "page_number": page_obj.number,
                "total_pages": paginator.num_pages,
                "has_next_page": page_obj.has_next(),
                "has_previous_page": page_obj.has_previous(),
                "next_page":next_page
            },
            "message": "success"
        }

        return Response(response)
            


