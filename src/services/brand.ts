import { callApi } from '../apis';

const getAllBrand = (id: string) => {
  return callApi(`/shops/${id}/brands`, 'get');
};

export const brand = {
  getAllBrand,
};
