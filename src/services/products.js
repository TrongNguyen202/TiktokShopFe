import { callApi } from '../apis'

const getAllProducts = (id) => {
  return callApi(
    `/shops/${id}/products/list`, 'get')
}

const getProductsById = (shopId, productId) => {
  return callApi(`/shops/${shopId}/products/${productId}`, 'get')
}

const changeStatusProduct = (id, params) => {
  return callApi(`/admin/v1/products/${id}`, 'put', params)
}

const createProductList = (shopId, params) => {
  return callApi(`/shops/${shopId}/products/create_product_excel3`, 'post', params)
}

export const products = {
  getAllProducts,
  getProductsById,
  changeStatusProduct,
  createProductList,
}
