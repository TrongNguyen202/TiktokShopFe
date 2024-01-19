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

const editProduct = (shopId, productId, body) => {
  return callApi(`/shops/${shopId}/products/update_product/${productId}`, 'put', body)
}

const createOneProduct = (shopId, body) => {
  return callApi(`/shops/${shopId}/products/create_product`, 'post', body)
}

export const products = {
  getAllProducts,
  getProductsById,
  changeStatusProduct,
  createProductList,
  editProduct,
  createOneProduct
}
