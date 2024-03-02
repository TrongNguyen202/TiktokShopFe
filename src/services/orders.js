import { callApi } from '../apis'

const getAllOrders = (id) => {
  return callApi(
    `/shops/${id}/orders/detail`, 'get')
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

const createLabel = (shopId, body) => {
  return callApi(`/shops/${shopId}/packages/package_detail`, 'post', body)
}

const shippingService = (shopId, body) => {
  return callApi(`/shops/${shopId}/shipping_service`, 'post', body)
}

const buyLabel = (shopId, body) => {
  return callApi(`/shops/${shopId}/packages/buy_label`, 'post', body)
}

const getShippingDoc = (id, body) => {
  return callApi(`/shops/${id}/get_shipping_doc_package_ids`, 'post', body)
}



export const orders = {
    getAllOrders,
    getLabelsById,
    uploadLabelToDriver,
    getToShipInfo,
    getAllCombine,
    confirmCombine,
    createLabel,
    shippingService,
    buyLabel,
    getShippingDoc,
}
