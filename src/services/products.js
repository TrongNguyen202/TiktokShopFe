import { callApi } from '../apis'

const getAllProducts = (id) => {
  return callApi(
    `/shops/${id}/products/list`, 'get')
}

const getProductsById = (id) => {
  return callApi(`/admin/v1/products/${id}`, 'get')
}

const changeStatusProduct = (id, params) => {
  return callApi(`/admin/v1/products/${id}`, 'put', params)
}

export const products = {
  getAllProducts,
  getProductsById,
  changeStatusProduct,
}
