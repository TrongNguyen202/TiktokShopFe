export type ProductImageItem = {
  id?: string;
  uid?: string;
  url: string;
  thumbUrl?: string;
};
export type ProductItem = {
  id: string;
  sku: any[] | string;
  title: string;
  warehouse: string;
  description: string;
  images?: ProductImageItem[];
  siteProductId: string;
  price: number;
  url: string;
};

export type ProductItemCrawl = {
  id: string;
  title: string;
  price: number;
  url: string;
  sku: string;
  description: string;
  images: ProductImageItem[];
  listing_id: number;
  last_modified: string;
  sold: number;
  total_sold: number;
  views: number;
  views_24h: number;
  original_creation: string;
  estimated_revenue: string;
  daily_views: number;
  num_favorers: number;
  hey: number;
};
