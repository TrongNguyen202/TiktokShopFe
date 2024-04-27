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
