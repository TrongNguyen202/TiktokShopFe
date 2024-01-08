import { callApi } from '../apis'

const getWarehousesByShopId = (id) => {
  return callApi(`/shops/${id}/warehouses`, 'get')
}
export const warehouses = {
  getWarehousesByShopId
}
