from ....models import UserGroup, Shop, User, UserShop
from ....serializers import ShopSerializers, ShopRequestSerializers
from api.views import *

logger = logging.getLogger('api.views.tiktok.shop')
setup_logging(logger, is_root=False, level=logging.INFO)


class Shops(APIView):
    permission_classes = (IsAuthenticated, )

    def get_user_group(self, user):
        """
            Lấy thông tin group (department) của user        
        """
        try:
            user_group = UserGroup.objects.get(user=user)
            return user_group.group_custom
        except UserGroup.DoesNotExist:
            return None

    @extend_schema(
        request=ShopSerializers,
        responses=ShopSerializers,
    )
    def get(self, request):
        # List ra các cửa hàng mà user đã đăng ký
        user_shops = UserShop.objects.filter(user=request.user)

        # Lấy ra thông tin của các cửa hàng
        shop_ids = [user_shop.shop_id for user_shop in user_shops]
        shops = Shop.objects.filter(id__in=shop_ids)
        serializer = ShopSerializers(shops, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=ShopRequestSerializers,
        responses=ShopSerializers
    )
    def post(self, request):
        auth_code = request.data.get('auth_code', None)
        shop_name = request.data.get('shop_name', None)
        shop_code = request.data.get('shop_code', None)
        user_seller_id = request.data.get('user_id', None)

        if not auth_code:
            logger.error(f'User {request.user} does not provide auth_code')
            return Response({'error': 'auth_code is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Từ auth_code, lấy access_token và refresh_token
        response = token.getAccessToken(auth_code=auth_code)
        group_custom = self.get_user_group(user=self.request.user)
        logger.info(f'User {self.request.user} is in group (department) {group_custom}')

        if response.status_code == 200:
            json_data = response.json()
            data = json_data.get('data', None)
            access_token = data.get('access_token', None)
            refresh_token = data.get('refresh_token', None)
            logger.info(f'Access token: {access_token}, Refresh token: {refresh_token}')
        else:
            logger.error(f'User {request.user}: Get access token failed: {response.text}')
            return Response(
                {'error': 'Failed to retrieve access_token or refresh_token from the response', 'detail': response.text},
                status=response.status_code
            )

        if not access_token or not refresh_token:
            logger.error(f'User {request.user}: Get access token failed: {response.text}')
            return Response(
                {'error': 'Failed to retrieve access_token or refresh_token from the response', 'detail': response.text},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Sau khi lấy được access_token và refresh_token, lưu vào database
        shop_data = {
            'auth_code': auth_code,
            'app_key': constant.app_key,
            'app_secret': constant.secret,
            'grant_type': 'authorized_code',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'shop_name': shop_name,
            'shop_code': shop_code,
            'group_custom_id': group_custom.id
        }

        shop_serializer = ShopSerializers(data=shop_data)

        if shop_serializer.is_valid():
            shop_code = shop_data.get('shop_code')

            # Kiểm tra xem shop đã tồn tại trong database chưa
            if Shop.objects.filter(shop_code=shop_code).exists():
                existing_shop = Shop.objects.get(shop_code=shop_code)

                # Cập nhật instance cửa hàng hiện có với access_token và refresh_token mới
                existing_shop.access_token = access_token
                existing_shop.refresh_token = refresh_token
                existing_shop.save()

                return Response(
                    shop_serializer.data,
                    status=status.HTTP_201_CREATED
                )

            # Nếu shop chưa tồn tại, tạo mới
            new_shop = shop_serializer.save()

            if user_seller_id:
                try:
                    user_seller = User.objects.get(id=user_seller_id)
                    UserShop.objects.create(user=user_seller, shop=new_shop)
                except User.DoesNotExist:
                    logger.error(f'User {user_seller_id} does not exist')
                    return Response(
                        {'error': f'User {user_seller_id} does not exist'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(
                shop_serializer.data,
                status=status.HTTP_201_CREATED
            )

        # Nếu dữ liệu không hợp lệ, trả về thông báo lỗi
        logger.error(f'User {request.user}: Invalid shop data: {shop_serializer.errors}')
        return Response(
            shop_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ShopDetail(APIView):
    def put(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        shop_serializer = ShopSerializers(shop, data=request.data)

        if shop_serializer.is_valid():
            shop_serializer.save()
            return Response(shop_serializer.data, status=status.HTTP_200_OK)
        else:
            logger.error(f'User {request.user}: Invalid shop data: {shop_serializer.errors}')
            return Response(shop_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        shop_serializer = ShopSerializers(shop)
        return Response(shop_serializer.data)

    def delete(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)

        try:
            shop.delete()
            return Response(
                {
                    'status': 'success',
                    'message': f'Shop with id {shop_id} deleted successfully'
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            logger.error(f'User {request.user}: Delete shop failed: {e}')
            return Response(
                {'error': f'Failed to delete shop with id {shop_id}: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ShopSearchViews(ListAPIView):
    serializer_class = ShopSerializers

    @extend_schema(
        parameters=[
            OpenApiParameter(name='shop_name', required=False, type=str),
            OpenApiParameter(name='shop_code', required=False, type=str)
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)

    def get_queryset(self):
        queryset = Shop.objects.all()

        shop_name = self.request.query_params.get('shop_name', None)
        shop_code = self.request.query_params.get('shop_code', None)

        if shop_name:
            queryset = queryset.filter(shop_name__icontains=shop_name)
        if shop_code:
            queryset = queryset.filter(shop_code__icontains=shop_code)

        return queryset


class UserShopList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        users_groups = get_object_or_404(UserGroup, user=user)
        if users_groups is None:
            return Response({"message": "User does not belong to any group."}, status=404)

        group_custom = users_groups.group_custom
        user_shops_data = {"group_id": group_custom.id, "group_name": group_custom.group_name, "users": []}

        for user_group in group_custom.usergroup_set.filter(role__in=[1, 2]):
            user_data = {
                "user_id": user_group.user.id,
                "user_name": user_group.user.username,
                "first_name": user_group.user.first_name,
                "last_name": user_group.user.last_name,
                "password": user_group.user.password,
                "email": user_group.user.email,
                "shops": []
            }

            user_shops = UserShop.objects.filter(user=user_group.user, shop__group_custom_id=group_custom.id)
            for user_shop in user_shops:
                user_data["shops"].append({"id": user_shop.shop.id, "name": user_shop.shop.shop_name})

            user_shops_data["users"].append(user_data)

        return Response({"data": user_shops_data})


class ShopList(APIView):
    """
        Get shop managed by specific user
    """

    def get(self, request):
        user_shop = UserShop.objects.filter(user=request.user)
        shops = Shop.objects.filter(id=user_shop.shop.id)
        serializer = ShopSerializers(shops, many=True)
        return Response(serializer.data)


class ShopListAPI(APIView):
    """
        List all shops of all users
    """

    def get(self, request):
        shops = Shop.objects.filter()
        serializer = ShopSerializers(shops, many=True)
        return Response(serializer.data)
