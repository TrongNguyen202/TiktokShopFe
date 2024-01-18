import { callApi } from '../apis'

const getAllCategories = () => {
  return callApi('/admin/v1/categories', 'get')
}

const getCategoriesById = (id) => {
  return callApi(`/shops/${id}/categories`, 'get')
}

const getAllCategoriesIsLeaf = (id) => {
  return callApi(`/categories/global`, 'get')
}

const getCustomerById = (id) => {
  return callApi(`/admin/v1/categories/${id}`, 'get')
}

export const categories = {
  getAllCategories,
  getCategoriesById,
  getCustomerById,
  getAllCategoriesIsLeaf
}
