from uuid import uuid4

from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from tiktok.settings import EMAIL_HOST_USER
from .models import CustomUser
import hmac
import hashlib
from datetime import datetime
import base64
from PIL import Image, WebPImagePlugin
WebPImageFile = WebPImagePlugin.WebPImageFile


def check_token(user, token):
    return user.customuser.verify_token == token




def send_mail_verification(request, new_user):
    verify_token = uuid4()
    CustomUser.objects.create(user=new_user, verify_token=verify_token)
    mail_subject = "Activate your account."
    verify_url = reverse(
        "verify",
        kwargs={
            "uidb64": urlsafe_base64_encode(force_bytes(new_user.pk)),
            "token": str(verify_token),
        },
    )
    mail_message = (
        f"Hi {new_user.username}, Please use this link to verify your account\n"
        f"{request.build_absolute_uri(verify_url)}"
    )
    from_email = EMAIL_HOST_USER
    send_mail(
        mail_subject,
        mail_message,
        from_email,
        [new_user.email],
        fail_silently=False,
    )

# generate sign
class GenerateSign:
    def obj_key_sort(self,obj):
        return {k: obj[k] for k in sorted(obj)}

    def get_timestamp(self):
        return int(datetime.now().timestamp())

    def cal_sign(self,secret, url, query_params, body):
        sorted_params = self.obj_key_sort(query_params)
        sorted_params.pop("sign", None)
        sorted_params.pop("access_token", None)
        sign_string = secret + url.path
        for key, value in sorted_params.items():
            sign_string += key + str(value)
        sign_string += body + secret
        signature = hmac.new(secret.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
        return signature

class GenerateSignNoBody:
    def obj_key_sort(self,obj):
        return {k: obj[k] for k in sorted(obj)}

    def get_timestamp(self):
        return int(datetime.now().timestamp())

    def cal_sign(self,secret, url, query_params):
        sorted_params = self.obj_key_sort(query_params)
        sorted_params.pop("sign", None)
        sorted_params.pop("access_token", None)
        sign_string = secret + url.path
        for key, value in sorted_params.items():
            sign_string += key + str(value)
        sign_string +=  secret
        signature = hmac.new(secret.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
        return signature


def is_webp_image_without_bits(img):
  
    if isinstance(img, WebPImageFile):
        try:
            bits = img.bits
        except AttributeError:
            return True
    return False

