export type TemplateItem = {
  id: number;
  name: string;
  colors: string[];
  fixed_images: {
    image1: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    image6?: string;
    image7?: string;
    image8?: string;
    image9?: string;
  };
  types: TypesItem[];
  badWords: string[];
  suffixTitle: string;
  category_id: number[];
  is_cod_open: boolean;
  warehouse_id: string;
  package_height: number;
  package_length: number;
  package_weight: number;
  package_width: number;
  description: string;
  size_chart: string;
};

export type TypesItem = {
  id?: string;
  price?: number;
  quantity?: number;
  sales_attributes?: {
    attribute_name?: string;
    custom_value?: string;
    attribute_id?: string;
  }[];
  original_price?: number;
  stock_infos?: {
    warehouse_id?: string;
    available_stock?: number;
  }[];
  seller_sku?: string;
  sku?: string;
};
