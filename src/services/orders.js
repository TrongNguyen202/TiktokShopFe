import { callApi } from '../apis'

const getAllOrders = (id) => {
  return callApi(
    `/shops/${id}/orders/list`, 'get')
}
export const orders = {
    getAllOrders
}
