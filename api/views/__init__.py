from django.db import transaction
from django.db.utils import IntegrityError
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.http import HttpResponse, JsonResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist


from drf_spectacular.utils import extend_schema, OpenApiParameter

from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from api.utils.tiktok_base_api import product, token, order
import api.utils.constant as constant
import api.utils.objectcreate as objectcreate
import api.helpers as helpers
from api import setup_logging

from concurrent.futures import ThreadPoolExecutor
from PIL import Image

import os
import uuid
import requests
import json
import logging
import traceback
import base64
import platform
import pandas as pd
