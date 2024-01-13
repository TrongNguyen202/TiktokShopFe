from .constant import secret,TIKTOK_API_URL,app_key,grant_type,ProductObject
from api.helpers import GenerateSign,GenerateSignNoBody
import requests
import json
import urllib.parse
from django.http import HttpResponse

import traceback

SIGN = GenerateSign()
SIGNNOBODY =GenerateSignNoBody()
def callProductList(access_token):
    url = TIKTOK_API_URL['url_product_list']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp()
    }
    body = json.dumps({
        "page_size": 50,
        "page_number": 1,
        "search_status": 0,
        "seller_sku_list": []
    })

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign
    
    response = requests.post(url, params=query_params, json=json.loads(body))
  
    # Process the response
    print(response.status_code)
    print(response.text)
    return response

def getAccessToken(auth_code):
    url = TIKTOK_API_URL['url_get_access_token']
  
    body = json.dumps({

       "app_key":app_key,
       "app_secret":secret,
       "grant_type":grant_type,
       "auth_code":auth_code,
    })

    response = requests.post(url, json=json.loads(body))
    print(response.status_code)
    print(response.text)
    return response

def refreshToken(refreshToken):
    url = TIKTOK_API_URL['url_refresh_token']
    body = json.dumps({

       "app_key":app_key,
       "app_secret":secret,
       "refresh_token":refreshToken,
       "grant_type":"refresh_token",
    })
    response = requests.post(url, json=json.loads(body))
    print(response.status_code)
    print(response.text)
    return response


def callProductDetail(access_token,product_id):
    url = TIKTOK_API_URL['url_detail_product']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        "product_id":product_id,
    }
   

    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign
    
    response = requests.get(url, params=query_params)
  
    # Process the response
    print(response.status_code)
    print(response.text)
    return response


# def getActiveShop(access_token):
#     url = TIKTOK_API_URL['url_get_active_shop']
#     query_params = {
#         "app_key": "6atknvel13hna",
#         "access_token": access_token,
#         "timestamp": SIGN.get_timestamp()
#     }
   

#     sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params )
#     query_params["sign"] = sign
    
#     response = requests.post(url, params=query_params)
  
#     # Process the response
#     print(response.status_code)
#     print(response.text)
#     return response

def getCategories(access_token):
    url = TIKTOK_API_URL['url_get_categories']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGNNOBODY.get_timestamp(),
        
    }
   

    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign
    
    response = requests.get(url, params=query_params)
  
    # Process the response

    return response

def getWareHouseList(access_token):
    url = TIKTOK_API_URL['url_get_warehouse']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGNNOBODY.get_timestamp(),
        
    }
   

    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign
    
    response = requests.get(url, params=query_params)
  
    # Process the response

    return response
    


def callUploadImage(access_token, img_data):
    try:
        url = TIKTOK_API_URL['url_upload_image']

        query_params = {
            "app_key": app_key,
            "access_token": access_token,
            "timestamp": SIGN.get_timestamp(),
        }

        body = json.dumps({
            "img_data": img_data,
            "img_scene": 1
        })

        sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
        query_params["sign"] = sign

        response = requests.post(url, params=query_params, json=json.loads(body))

        data = json.loads(response.text)
     
       

        if "data" in data and "img_id" in data["data"]:
            img_id = data["data"]["img_id"]
            return img_id
        else:
          
            raise Exception("Invalid response format: 'data' or 'img_id' not found in the response")

    except Exception as e:
      
        print(f"Error in callUploadImage: {str(e)}")
        print(traceback.format_exc())
        print(f"Error in callUploadImage: {str(e)}")
        raise 
   

def createProduct(access_token,title,images_ids,product_object):
    url = TIKTOK_API_URL['url_create_product']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),

    }
    images_list = [{"id": image_id} for image_id in images_ids]
    skus_list = []
    for sku in product_object.skus:
        sales_attributes_list = [
            {
                "attribute_id": attr.attribute_id,
                "attribute_name": attr.attribute_name,
                "custom_value": attr.value_name,
            } for attr in sku.sales_attributes
        ]
        stock_infos_list = [
            {
                "warehouse_id": info.warehouse_id,
                "available_stock": info.available_stock
            } for info in sku.stock_infos
        ]
        skus_list.append({
            "sales_attributes": sales_attributes_list,
            "original_price": sku.original_price,
            "stock_infos": stock_infos_list
        })

    bodyjson = {
        "product_name": title,
        "images": images_list,
        "is_cod_open": product_object.is_cod_open,
        "package_dimension_unit": "metric",
        "package_height": product_object.package_height,
        "package_length": product_object.package_length,
        "package_weight": product_object.package_weight,
        "package_width": product_object.package_width,
        "category_id": product_object.category_id,
        "description": product_object.description or "",
        "skus": skus_list
    }

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    query_params["sign"] = sign
    response = requests.post(url, params=query_params, json=json.loads(body))

    # Process the response
    print(response.status_code)
    print(response.text)
    return HttpResponse(response)

def getBrands(access_token):
    url = TIKTOK_API_URL['url_get_brands']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        
    }


    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign
    
    response = requests.get(url, params=query_params)
  
    print(response.status_code)
    print(response.text)
    return response



def getBrands(access_token):
    url = TIKTOK_API_URL['url_get_brands']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
        
    }


    sign = SIGNNOBODY.cal_sign(secret, urllib.parse.urlparse(url), query_params)
    query_params["sign"] = sign
    
    response = requests.get(url, params=query_params)
  
    print(response.status_code)
    print(response.text)
    return response


def callEditProduct(access_token, product_object):
    url = TIKTOK_API_URL['url_edit_product']
    query_params = {
        "app_key": app_key,
        "access_token": access_token,
        "timestamp": SIGN.get_timestamp(),
    }

    images_list = [{"id": image["id"]} for image in product_object.images]

    skus_list = []
    for sku in product_object.skus:
        sales_attributes_list = [
            {
                "attribute_id": attr.attribute_id,
                "attribute_name": attr.attribute_name,
                "value_id": attr.value_id,
                "value_name": attr.value_name,
            } for attr in sku.sales_attributes
        ]
        stock_infos_list = [
            {
                "warehouse_id": info.warehouse_id,
                "available_stock": info.available_stock
            } for info in sku.stock_infos
        ]
        skus_list.append({
            "sales_attributes": sales_attributes_list,
            "original_price": sku.original_price,
            "stock_infos": stock_infos_list
        })

    bodyjson = {
        "product_id": product_object.product_id,
        "product_name": product_object.product_name,
        "images": images_list,
        "price": product_object.price,
        "is_cod_open": product_object.is_cod_open,
        "package_dimension_unit": product_object.package_dimension_unit,
        "package_height": product_object.package_height,
        "package_length": product_object.package_length,
        "package_weight": product_object.package_weight,
        "package_width": product_object.package_width,
        "category_id": product_object.category_id,
        "description": product_object.description,
        "skus": skus_list
    }

    body = json.dumps(bodyjson)

    sign = SIGN.cal_sign(secret, urllib.parse.urlparse(url), query_params, body)
    query_params["sign"] = sign

    response = requests.put(url, params=query_params, json=bodyjson)

    # Process the response
    print(response.status_code)
    print(response.text)
    return HttpResponse(response)
