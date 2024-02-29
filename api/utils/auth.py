import time
import hmac
import hashlib
from uuid import uuid4
from ..models import CustomUser

from tiktok.settings import EMAIL_HOST_USER

from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def send_mail_verification(request, new_user):
    verify_token = uuid4()

    # Tạo user mới vào database
    CustomUser.objects.create(
        user=new_user,
        verify_token=verify_token
    )

    # Mail subject
    mail_subject = 'Activate your account'

    # Tạo link verify
    verify_url = reverse(
        'verify',
        kwargs={
            'uidb64': urlsafe_base64_encode(force_bytes(new_user.id)),
            'token': str(verify_token)
        },
    )

    # Nội dung email
    mail_message = (
        f'Hi {new_user.username}, Please use this link to verify your account:\n'
        f'{request.build_absolute_uri(verify_url)}\n'
    )

    # Gửi email
    send_mail(
        subject=mail_subject,
        message=mail_message,
        from_email=EMAIL_HOST_USER,
        recipient_list=[new_user.email],
        fail_silently=False
    )


class GenerateSign:
    def obj_key_sort(self, obj):
        return {k: obj[k] for k in sorted(obj)}

    def get_timestamp(self):
        return int(time.time())

    def cal_sign(self, secrete, url, query_params, body):
        sorted_params = self.obj_key_sort(query_params)
        sorted_params.pop('sign', None)
        sorted_params.pop('access_token', None)

        sign_string = secrete + url.path
        for key, value in sorted_params.items():
            sign_string += key + value

        sign_string += body + secrete
        signature = hmac.new(secrete.encode(), sign_string.encode(), hashlib.sha256).hexdigest()

        return signature
