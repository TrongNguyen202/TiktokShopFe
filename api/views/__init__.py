import base64
import json
import logging
import os
import platform
import traceback
import uuid
from concurrent.futures import ThreadPoolExecutor

import pandas as pd
import requests
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import Q
from django.db.utils import IntegrityError
from django.forms.models import model_to_dict
from django.http import FileResponse, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from drf_spectacular.utils import OpenApiParameter, extend_schema
from PIL import Image
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import api.helpers as helpers
import api.utils.constant as constant
import api.utils.objectcreate as objectcreate
from api import setup_logging
from api.utils.tiktok_base_api import order, product, token
