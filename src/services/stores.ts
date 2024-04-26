import { callApi } from '../apis';

const getAllStores = () => {
  return callApi('/shops', 'get');
};

const createStore = (params: Record<string, unknown>) => {
  return callApi('/shops', 'post', params);
};

const getStoreById = (id: string) => {
  return callApi(`/shops/${id}`, 'get');
};

const updateStore = (id: string, params: Record<string, unknown>) => {
  return callApi(`/shops/${id}`, 'put', params);
};

const searchStores = (query: string) => {
  return callApi(`/shops?${query}`, 'get');
};

const refreshToken = (ShopId: string) => {
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
