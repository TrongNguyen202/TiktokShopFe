secret = "df329e59a6f78121409d77c33ee1decfbfa088a4"
app_key="6atknvel13hna"
grant_type="authorized_code"

TIKTOK_API_URL = {
  'url_product_list' : "https://open-api.tiktokglobalshop.com/api/products/search",
  'url_get_access_token':'https://auth.tiktok-shops.com/api/token/getAccessToken',
  'url_refresh_token':'https://auth.tiktok-shops.com/api/v2/token/refresh',
  'url_detail_product':'https://open-api.tiktokglobalshop.com/api/products/details',
  'url_get_active_shop':'https://open-api.tiktokglobalshop.com/api/seller/global/active_shops',
  'url_create_product': 'https://open-api.tiktokglobalshop.com/api/products',
  'url_get_categories':'https://open-api.tiktokglobalshop.com/api/products/categories',
  'url_get_warehouse':'https://open-api.tiktokglobalshop.com/api/logistics/get_warehouse_list',
  'url_upload_image':'https://open-api.tiktokglobalshop.com/api/products/upload_imgs',
  'url_get_brands':'https://open-api.tiktokglobalshop.com/api/products/brands',
  'url_edit_product':'https://open-api.tiktokglobalshop.com/api/products'

  
}

class ProductObject:
    def __init__(self, product_id, product_name, images, price, is_cod_open, 
                 package_dimension_unit, package_height, package_length, package_weight, package_width,
                 category_id, description, skus):
        self.product_id = product_id
        self.product_name = product_name
        self.images = images
        self.price = price
        self.is_cod_open = is_cod_open
        self.package_dimension_unit = package_dimension_unit
        self.package_height = package_height
        self.package_length = package_length
        self.package_weight = package_weight
        self.package_width = package_width
        self.category_id = category_id
        self.description = description
        self.skus = [SKU(**sku_data) for sku_data in skus]

    def to_json(self):
        skus_json = [sku.to_json() for sku in self.skus]
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "images": [{"id": image["id"]} for image in self.images],
            "price": self.price,
            "is_cod_open": self.is_cod_open,
            "package_dimension_unit": self.package_dimension_unit,
            "package_height": self.package_height,
            "package_length": self.package_length,
            "package_weight": self.package_weight,
            "package_width": self.package_width,
            "category_id": self.category_id,
            "description": self.description,
            "skus": skus_json
        }

class SKU:
    def __init__(self, sales_attributes, original_price, stock_infos):
        self.sales_attributes = [SalesAttribute(**attr) for attr in sales_attributes]
        self.original_price = original_price
        self.stock_infos = [StockInfo(**stock_info) for stock_info in stock_infos]

    def to_json(self):
        sales_attributes_json = [attr.to_json() for attr in self.sales_attributes]
        stock_infos_json = [info.to_json() for info in self.stock_infos]
        return {
            "sales_attributes": sales_attributes_json,
            "original_price": self.original_price,
            "stock_infos": stock_infos_json
        }

class SalesAttribute:
    def __init__(self, attribute_id, attribute_name, value_id, value_name):
        self.attribute_id = attribute_id
        self.attribute_name = attribute_name
        self.value_id = value_id
        self.value_name = value_name

    def to_json(self):
        return {
            "attribute_id": self.attribute_id,
            "attribute_name": self.attribute_name,
            "value_id": self.value_id,
            "value_name": self.value_name
        }

class StockInfo:
    def __init__(self, warehouse_id, available_stock):
        self.warehouse_id = warehouse_id
        self.available_stock = available_stock

    def to_json(self):
        return {
            "warehouse_id": self.warehouse_id,
            "available_stock": self.available_stock
        }


class ProductCreateObject:
    def __init__(self, is_cod_open, 
                 package_dimension_unit, package_height, package_length, package_weight, package_width,
                 category_id, warehouse_id,description, skus):
        
    
        self.is_cod_open = is_cod_open
        self.package_dimension_unit = package_dimension_unit
        self.package_height = package_height
        self.package_length = package_length
        self.package_weight = package_weight
        self.package_width = package_width
        self.category_id = category_id
        self.warehouse_id = warehouse_id
        self.description = description
        self.skus = [SKU(**sku_data) for sku_data in skus]

    def to_json(self):
        skus_json = [sku.to_json() for sku in self.skus]
        return {
        
          
            "is_cod_open": self.is_cod_open,
            "package_dimension_unit": self.package_dimension_unit,
            "package_height": self.package_height,
            "package_length": self.package_length,
            "package_weight": self.package_weight,
            "package_width": self.package_width,
            "category_id": self.category_id,
            "warehouse_id":self.warehouse_id,
            "description": self.description,
            "skus": skus_json
        }

class SKU:
    def __init__(self, sales_attributes, original_price, stock_infos):
        self.sales_attributes = [SalesAttribute(**attr) for attr in sales_attributes]
        self.original_price = original_price
        self.stock_infos = [StockInfo(**stock_info) for stock_info in stock_infos]

    def to_json(self):
        sales_attributes_json = [attr.to_json() for attr in self.sales_attributes]
        stock_infos_json = [info.to_json() for info in self.stock_infos]
        return {
            "sales_attributes": sales_attributes_json,
            "original_price": self.original_price,
            "stock_infos": stock_infos_json
        }

class SalesAttribute:
    def __init__(self, attribute_id, attribute_name, value_id, value_name):
        self.attribute_id = attribute_id
        self.attribute_name = attribute_name
        self.value_id = value_id
        self.value_name = value_name

    def to_json(self):
        return {
            "attribute_id": self.attribute_id,
            "attribute_name": self.attribute_name,
            "custom_value": self.value_name
        }

class StockInfo:
    def __init__(self, warehouse_id, available_stock):
        self.warehouse_id = warehouse_id
        self.available_stock = available_stock

    def to_json(self):
        return {
            "warehouse_id": self.warehouse_id,
            "available_stock": self.available_stock
        }


