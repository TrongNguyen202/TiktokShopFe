import { callApi } from '../apis';

const getAllOrders = (id: string) => {
  return callApi(`/shops/${id}/orders/detail`, 'get');
};

const getLabelsById = (orderId: string) => {
  return callApi(`/shops/orders/${orderId}/search_file`, 'get');
};

const uploadLabelToDriver = (body: any) => {
  return callApi(`/shops/upload_driver`, 'post', body);
};

const getToShipInfo = (shopId: string, body: any) => {
  return callApi(`/shops/${shopId}/orders/toship_infor`, 'post', body);
};

const getAllCombine = (shopId: string) => {
  return callApi(`/shops/${shopId}/pre_combine_pkg`, 'get');
};

const confirmCombine = (shopId: string, body: any) => {
  return callApi(`/shops/${shopId}/confirm_combine_pkg`, 'post', body);
};

const createLabel = (shopId: string, body: any) => {
  return callApi(`/shops/${shopId}/packages/package_detail`, 'post', body);
};

const shippingService = (shopId: string, body: any) => {
  return callApi(`/shops/${shopId}/shipping_service`, 'post', body);
};

const buyLabel = (shopId: string, body: any) => {
  return callApi(`/shops/${shopId}/packages/buy_label`, 'post', body);
};

const getShippingDoc = (id: string, body: any) => {
  return callApi(`/shops/${id}/get_shipping_doc_package_ids`, 'post', body);
};

const getPackageBought = () => {
  return callApi(`/shops/get_package_buyed`, 'get');
};

const pdfLabelSearch = (packageId: string) => {
  return callApi(`/pdf-search/?query=${packageId}`, 'get');
};

const pdfLabelLinkSearch = (body: any) => {
  return callApi(`/pdf-upload-search`, 'post', body);
};

const pdfLabelDownload = (fileName: string) => {
  return callApi(`/pdf-download/?filename=${fileName}`, 'get');
};

const getDesignSku = () => {
  return callApi('/designskus/', 'get');
};

const getDesignSkuSize = (page: string) => {
  return callApi(`/designskus/?page=${page}`, 'get');
};

const getDesignSkuByGroup = (groupId: string) => {
  return callApi(`/designskus/find_by_group/${groupId}`, 'get');
};

const getDesignSkuByGroupSize = (groupId: string, page: string) => {
  return callApi(`/designskus/find_by_group/${groupId}?page=${page}`, 'get');
};

const postDesignSku = (body: any) => {
  return callApi('/designskus/', 'post', body);
};

const putDesignSku = (body: any, designId: string) => {
  return callApi(`/designskus/${designId}/`, 'put', body);
};

const deleteDesignSku = (designId: string) => {
  return callApi(`/designskus/${designId}/`, 'delete');
};

const searchDesignSku = (body: any) => {
  return callApi(`/designskus/search/`, 'post', body);
};

const getDesignSkuById = (skuId: string) => {
  return callApi(`/designskus/${skuId}`, 'get');
};

const packageCreateFlashShip = (shopId: string, body: any) => {
  return callApi(`/shop/${shopId}/packages/create_flash`, 'post', body);
};

const packageCreatePrintCare = (shopId: string, body: any) => {
  return callApi(`/shop/${shopId}/packages/create_print`, 'post', body);
};

const packageFulfillmentCompleted = (shopId: string) => {
  return callApi(`/shop/${shopId}/packages/list`, 'get');
};

const packageFulfillmentCompletedInActive = (packageId: string, body: any) => {
  return callApi(`/package/${packageId}/deactive`, 'put', body);
};

const cancelOrder = (shopId: string, body: any) => {
  return callApi(`/shop/${shopId}/orders/cancel`, 'post', body);
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
  pdfLabelLinkSearch,
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
  packageFulfillmentCompletedInActive,
  cancelOrder,
};
