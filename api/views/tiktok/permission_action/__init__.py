
from ....models import User, UserShop, UserGroup, GroupCustom, CustomUserSendPrint

from ....serializers import GroupCustomSerializer

from api.views import *

logger = logging.getLogger('api.views.tiktok.permission_action')
setup_logging(logger, is_root=False, level=logging.INFO)


class AddUsertoGroup(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user_current = request.user
            user_group = UserGroup.objects.get(user=user_current)
            if not user_group.role == 1:
                return JsonResponse({"status": 404, "error": "you don't have permission to do this bro"}, status=404)
            username = request.data.get('username')
            password = request.data.get('password')
            email = request.data.get('email')
            firstname = request.data.get('first_name')
            lastname = request.data.get('last_name')
            shop_ids = request.data.get('shops')
            new_user = User.objects.create_user(username=username, password=password, email=email, first_name=firstname, last_name=lastname)
            group_custom = user_group.group_custom
            UserGroup.objects.create(user=new_user, group_custom=group_custom, role=2)
            if shop_ids:  # Check if shop_ids is provided and not empty
                for shop_id in shop_ids:
                    UserShop.objects.create(user=new_user, shop_id=shop_id)

            return JsonResponse({"status": 201, "message": "User added to group successfully."}, status=201)
        except ObjectDoesNotExist:
            return JsonResponse({"status": 404, "error": "Object does not exist."}, status=404)
        except Exception as e:
            return JsonResponse({"status": 500, "error": str(e)}, status=500)


class InforUserCurrent(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        user_groups = UserGroup.objects.filter(user=user)

        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'groups': [user_group.group_custom.group_name for user_group in user_groups]
        }
        return Response(user_info)


class UserInfo(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'password': user.password
        }

        return Response(user_info)


class AddUserToGroup(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user_current = request.user
            user_group = UserGroup.objects.get(user=user_current)
            if not user_group.role == 1:
                return JsonResponse({"status": 404, "error": "you don't have permission to do this bro"}, status=404)
            username = request.data.get('username')
            password = request.data.get('password')
            email = request.data.get('email')
            firstname = request.data.get('first_name')
            lastname = request.data.get('last_name')

            user_code = request.data.get('user_code', '')
            shop_ids = request.data.get('shops')
            new_user = User.objects.create_user(username=username, password=password, email=email, first_name=firstname, last_name=lastname)
            if user_code:
                CustomUserSendPrint.objects.create(user=new_user, user_code=user_code)

            group_custom = user_group.group_custom
            UserGroup.objects.create(user=new_user, group_custom=group_custom, role=2)
            for shop_id in shop_ids:
                UserShop.objects.create(user=new_user, shop_id=shop_id)

            return JsonResponse({"status": 201, "message": "User added to group successfully."}, status=201)
        except ObjectDoesNotExist:
            return JsonResponse({"status": 404, "error": "Object does not exist."}, status=404)
        except Exception as e:
            logger.error(f'Error when adding user to group', exc_info=e)
            return JsonResponse({"status": 500, "error": str(e)}, status=500)


class InforUserCurrent(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        user_groups = UserGroup.objects.filter(user=user)

        try:
            user_sen = CustomUserSendPrint.objects.get(user=user)
            user_code = user_sen.user_code
        except CustomUserSendPrint.DoesNotExist:
            user_code = ""  # Set default value if CustomUserSendPrint does not exist

        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'groups': [user_group.group_custom.group_name for user_group in user_groups],
            'role': [user_group.role for user_group in user_groups],
            'user_code': user_code
        }
        return Response(user_info)


class GroupCustomListAPIView(APIView):
    def get(self, request):
        group_customs = GroupCustom.objects.all().order_by('id')
        serializer = GroupCustomSerializer(group_customs, many=True)
        return Response(serializer.data)


class PermissionRole(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        data = request.data
        user_id = data.get('user_id')
        user = get_object_or_404(User, id=user_id)
        try:
            user_custom_senprint = CustomUserSendPrint.objects.get(user=user)
        except CustomUserSendPrint.DoesNotExist:
            user_custom_senprint = CustomUserSendPrint.objects.create(user=user)

        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        user_custom_senprint.user_code = data.get('user_code', user_custom_senprint.user_code)
        user.save()
        user_custom_senprint.save()

        stores = data.get('shops', [])

        for store_id in stores:

            UserShop.objects.get_or_create(user=user, shop_id=store_id)

        return Response({"message": "User information updated successfully."})

    def isManagerOrAdmin(self, user):
        user_group = get_object_or_404(UserGroup, user=user)
        return user_group.role
