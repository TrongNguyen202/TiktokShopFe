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

const editProduct = (shopId, productId, body) => {
  return callApi(`/shops/${shopId}/products/update_product/${productId}`, 'put', body)
}

const createProduct = (shopId, body) => {
  return callApi(`/shops/${shopId}/products/create_product`, 'post', body)
}

export const products = {
  getAllProducts,
  getProductsById,
  changeStatusProduct,
  editProduct,
  createProduct
}
