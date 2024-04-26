import { callApi } from '../apis';

const getWarehousesByShopId = (id: string) => {
  return callApi(`/shops/${id}/warehouses`, 'get');
};
export const warehouses = {
  getWarehousesByShopId,
};
