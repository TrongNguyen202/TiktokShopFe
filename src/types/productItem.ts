export type ProductImageItem = {
  id: string;
  uid: string;
  url: string;
};
export type ProductItem = {
  id: string;
  sku: any[];
  title: string;
  warehouse: string;
  description: string;
  images: ProductImageItem[];
  siteProductId: string;
};
