import { callApi } from '../apis';

const getAllProducts = (id: string, page_number: string) => {
  return callApi(`/shops/${id}/products/list/page=${page_number}`, 'get');
};

const getProductsById = (shopId: string, productId: string) => {
  return callApi(`/shops/${shopId}/products/${productId}`, 'get');
};

const changeStatusProduct = (id: string, params: Record<string, unknown>) => {
  return callApi(`/admin/v1/products/${id}`, 'put', params);
};

const createProductList = (shopId: string, params: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/products/create_product_excel3`, 'post', params);
};

const editProduct = (shopId: string, productId: string, body: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/products/update_product/${productId}`, 'put', body);
};

const createOneProduct = (shopId: string, body: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/products/create_product`, 'post', body);
};

const createOneProductDraff = (shopId: string, body: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/products/create_product_draf`, 'post', body);
};

const changeProductImageToWhite = (body: Record<string, unknown>) => {
  return callApi(`/crawl/process_image`, 'post', body);
};

const removeProduct = (shopId: string, body: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/products/delete_product`, 'post', body);
};

export const products = {
  getAllProducts,
  getProductsById,
  changeStatusProduct,
  createProductList,
  editProduct,
  createOneProduct,
  createOneProductDraff,
  changeProductImageToWhite,
  removeProduct,
};
