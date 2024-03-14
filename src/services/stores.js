import { callApi } from '../apis';

const getAllStores = () => {
  return callApi('/shops', 'get');
};

const createStore = (params) => {
  return callApi('/shops', 'post', params);
};

const getStoreById = (id) => {
  return callApi(`/shops/${id}`, 'get');
};

const updateStore = (id, params) => {
  return callApi(`/shops/${id}`, 'put', params);
};

const searchStores = (query) => {
  return callApi(`/shops?${query}`, 'get');
};

const refreshToken = (ShopId) => {
  return callApi(`/shops/${ShopId}/refreshtoken`, 'post');
};

export const stores = {
  getAllStores,
  getStoreById,
  searchStores,
  createStore,
  refreshToken,
  updateStore,
};
