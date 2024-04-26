import { callApi } from '../apis';

const getAllSellers = () => {
  return callApi('/admin/manage/users', 'get');
};

const getSellersById = (id: string) => {
  return callApi(`/admin/manage/users/${id}`, 'get');
};

const searchSeller = (query: string) => {
  return callApi(`/admin/manage/users?${query}`, 'get');
};

export const sellers = {
  getAllSellers,
  getSellersById,
  searchSeller,
};
