import { callApi } from '../apis';

const getAllOrders = (id) => {
  return callApi(`/shops/${id}/orders/detail`, 'get');
};

const getLabelsById = (orderId) => {
  return callApi(`/shops/orders/${orderId}/search_file`, 'get');
};

const uploadLabelToDriver = (body) => {
  return callApi(`/shops/upload_driver`, 'post', body);
};

const getToShipInfo = (shopId, body) => {
  return callApi(`/shops/${shopId}/orders/toship_infor`, 'post', body);
};

const getAllCombine = (shopId) => {
  return callApi(`/shops/${shopId}/pre_combine_pkg`, 'get');
};

const confirmCombine = (shopId, body) => {
  return callApi(`/shops/${shopId}/confirm_combine_pkg`, 'post', body);
};

const createLabel = (shopId, body) => {
  return callApi(`/shops/${shopId}/packages/package_detail`, 'post', body);
};

const shippingService = (shopId, body) => {
  return callApi(`/shops/${shopId}/shipping_service`, 'post', body);
};

const buyLabel = (shopId, body) => {
  return callApi(`/shops/${shopId}/packages/buy_label`, 'post', body);
};

const getShippingDoc = (id, body) => {
  return callApi(`/shops/${id}/get_shipping_doc_package_ids`, 'post', body);
};

const getPackageBought = () => {
  return callApi(`/shops/get_package_buyed`, 'get');
};

const pdfLabelSearch = (packageId) => {
  return callApi(`/pdf-search/?query=${packageId}`, 'get');
};

const pdfLabelDownload = (fileName) => {
  return callApi(`/pdf-download/?filename=${fileName}`, 'get');
};

const getDesignSku = () => {
  return callApi('/designskus/', 'get');
};

const getDesignSkuSize = (page) => {
  return callApi(`/designskus/?page=${page}`, 'get');
};

const getDesignSkuByGroup = (groupId) => {
  return callApi(`/designskus/find_by_group/${groupId}`, 'get');
};

const getDesignSkuByGroupSize = (groupId, page) => {
  return callApi(`/designskus/find_by_group/${groupId}?page=${page}`, 'get');
};

const postDesignSku = (body) => {
  return callApi('/designskus/', 'post', body);
};

const putDesignSku = (body, DesignId) => {
  return callApi(`/designskus/${DesignId}/`, 'put', body);
};

const deleteDesignSku = (DesignId) => {
  return callApi(`/designskus/${DesignId}/`, 'delete');
};

const searchDesignSku = (body) => {
  return callApi(`/designskus/search/`, 'post', body);
};

const getDesignSkuById = (skuId) => {
  return callApi(`/designskus/${skuId}`, 'get');
};

const packageCreateFlashShip = (shopId, body) => {
  return callApi(`/shop/${shopId}/packages/create_flash`, 'post', body);
};

const packageCreatePrintCare = (shopId, body) => {
  return callApi(`/shop/${shopId}/packages/create_print`, 'post', body);
};

const packageFulfillmentCompleted = (shopId) => {
  return callApi(`/shop/${shopId}/packages/list`, 'get');
};

const packageFulfillmentCompletedInActive = (packageId) => {
  return callApi(`/package/${packageId}/deactive`, 'put', body);
};

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
  getPackageBought,
  pdfLabelSearch,
  pdfLabelDownload,
  getDesignSku,
  getDesignSkuSize,
  getDesignSkuByGroup,
  getDesignSkuByGroupSize,
  postDesignSku,
  putDesignSku,
  deleteDesignSku,
  searchDesignSku,
  getDesignSkuById,
  packageCreateFlashShip,
  packageCreatePrintCare,
  packageFulfillmentCompleted,
  packageFulfillmentCompletedInActive
};
