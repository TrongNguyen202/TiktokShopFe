from api import setup_logging
import requests
import logging
import json
import traceback
import urllib.parse

from ..constant import secret, TIKTOK_API_URL, app_key
from api.utils.auth import GenerateSign
from django.http import HttpResponse

logger = logging.getLogger('api.utils.tiktok_base_api')
setup_logging(logger, is_root=False, level=logging.INFO)

# Hàm tạo signature cho Tiktok API
SIGN = GenerateSign()
