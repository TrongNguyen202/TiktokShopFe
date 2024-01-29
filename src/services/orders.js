import { callApi } from '../apis'

const getAllOrders = (id) => {
  return callApi(
    `/shops/${id}/orders/detail`, 'get')
}

const buyLabels = (id, body) => {
  return callApi(`/shops/${id}/buy_lebal`, 'post', body)
}

export const orders = {
    getAllOrders,
    buyLabels
}
