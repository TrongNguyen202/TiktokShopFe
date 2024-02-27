import { callApi } from '../apis'

const getAllOrders = (id) => {
  return callApi(
    `/shops/${id}/orders/detail`, 'get')
}

const buyLabels = (id, body) => {
  return callApi(`/shops/${id}/buy_lebal`, 'post', body)
}

const getLabelsById = (orderId) => {
  return callApi(`/shops/orders/${orderId}/search_file`, 'get')
}

const uploadLabelToDriver = (body) => {
  return callApi(`/shops/upload_driver`, 'post', body)
}

const getToShipInfo = (shopId, body) => {
  return callApi(`/shops/${shopId}/orders/toship_infor`, 'post', body)
}

const getAllCombine = (shopId) => {
  return callApi(`/shops/${shopId}/pre_combine_pkg`, 'get')
}

const confirmCombine = (shopId, body) => {
  return callApi(`/shops/${shopId}/confirm_combine_pkg`, 'post', body)
}

export const orders = {
    getAllOrders,
    buyLabels,
    getLabelsById,
    uploadLabelToDriver,
    getToShipInfo,
    getAllCombine,
    confirmCombine
}
