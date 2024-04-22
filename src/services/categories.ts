import { callApi } from '../apis';

const getAllCategories = () => {
  return callApi('/admin/v1/categories', 'get');
};

const getCategoriesById = (id: string) => {
  return callApi(`/shops/${id}/categories`, 'get');
};

const getAllCategoriesIsLeaf = () => {
  return callApi(`/categories/global`, 'get');
};

const getAllCategoriesIsLeafType2 = (id: string) => {
  return callApi(`/shops/${id}/categories/is_leaf`, 'get');
};

const getCustomerById = (id: string) => {
  return callApi(`/admin/v1/categories/${id}`, 'get');
};

const getAttributeByCategory = (shopId: string, categoryId: string) => {
  return callApi(`/shops/${shopId}/categories/${categoryId}/products/get_attribute`, 'get');
};

const recommendCategory = (shopId: string, data: any) => {
  return callApi(`/shops/${shopId}/category_recommend`, 'post', data);
};

export const categories = {
  getAllCategories,
  getCategoriesById,
  getCustomerById,
  getAllCategoriesIsLeaf,
  getAllCategoriesIsLeafType2,
  getAttributeByCategory,
  recommendCategory,
};
