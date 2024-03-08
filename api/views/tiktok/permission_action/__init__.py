from ....models import User, UserShop, UserGroup

from api.views import *

logger = logging.getLogger('api.views.tiktok.permission_action')
setup_logging(logger, is_root=False, level=logging.INFO)


class PermissionRole(APIView):

    def post(self, request):
        data = request.data
        user_id = data.get('user_id')
        user = get_object_or_404(User, id=user_id)

        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.save()

        stores = data.get('stores', [])

        # Gán lại các store cho user
        for store_id in stores:
            UserShop.objects.get_or_create(user=user, store_id=store_id)

        return Response({'message': 'User information has been updated successfully.'})

    def isManagerOrAdmin(self, user):
        user_group = get_object_or_404(UserGroup, user=user)
        return user_group.role


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
