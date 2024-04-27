export type stockInfosProduct = {
  available_stock: number;
  warehouse_id: string;
};

export type variationProduct = {
  id: string;
  name: string;
  value_id: string;
  value_name: string;
};

export type ImageProductDetail = {
  id: string;
  width: number;
  height: number;
  thumb_url_list: string[];
  url_list: string[];
};

export type VideoProductDetail = {
  duration: number;
  id: string;
  media_type: string;
  post_url: string;
  video_infos: {
    backup_url: string;
    bitrate: number;
    file_hash: string;
    format: string;
    height: string;
    main_url: string;
    size: number;
    url_expire: number;
    width: string;
  }[];
};

export type AttributeProduct = {
  [key: string]: { value: string; label: string }[] | string;
};

export type SkuProductDetail = {
  id: string;
  price: {
    currency: string;
    original_price: number;
  };
  sales_attributes: variationProduct[];
  seller_sku: string;
  stock_infos: stockInfosProduct[];
};

export type WareHouseProduct = {
  is_default: boolean;
  warehouse_address: {
    [key: string]: string;
  };
  warehouse_effect_status: number;
  warehouse_id: string;
  warehouse_name: string;
  warehouse_status: number;
  warehouse_sub_type: number;
  warehouse_type: number;
};

export type productDetail = {
  category_list: {
    id: string;
    is_leaf: boolean;
    local_display_name: string;
    parent_id: string;
  }[];
  create_time: number;
  description: string;
  images: ImageProductDetail[];
  is_cod_open: boolean;
  package_dimension_unit: string;
  package_height: number;
  package_length: number;
  package_weight: string;
  package_width: number;
  product_id: string;
  product_name: string;
  product_status: number;
  size_chart: ImageProductDetail[];
  skus: SkuProductDetail[];
  update_time: number;
  video: VideoProductDetail;
  warranty_period: {
    warranty_description: string;
    warranty_id: number;
  };
  warranty_policy: string;
};

// product new
export type variationProductNew = {
  attribute_id: string;
  attribute_name: string;
  custom_value: string;
};

export type SkuProductNew = {
  original_price: number;
  sales_attributes: variationProductNew[];
  seller_sku?: string;
  stock_infos: stockInfosProduct[];
};

export type SkuProductForm = {
  variations: variationProduct[];
  price: number;
  stock_infos: stockInfosProduct;
  seller_sku: string;
  key: string;
};

export type productNew = {
  brand_id: string;
  category_id: number;
  description: string;
  images?: string[];
  is_cod_open: boolean;
  package_dimension_unit: string;
  package_height: number;
  package_length: number;
  package_weight: string;
  package_width: number;
  product_attributes?: any[];
  product_name: string;
  product_status?: number;
  size_chart?: {
    img_id: string;
  };
  skus: SkuProductNew[];
};
