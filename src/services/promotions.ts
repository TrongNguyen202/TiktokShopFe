import { callApi } from '../apis';

const getPromotions = (id, pageNumber, searchValue = '', filterStatus = undefined) => {
  return callApi(
    `/shops/${id}/promotions?page_number=${pageNumber}&title=${searchValue}${filterStatus && filterStatus !== 'all' ? `&status=${filterStatus}` : ''}`,
    'get',
  );
};

const getPromotionDetail = (shopId, promotionId) => {
  return callApi(`/shops/${shopId}/promotions/${promotionId}`, 'get');
};

const createPromotion = (shopId, params) => {
  return callApi(`/shops/${shopId}/promotions/create_discount`, 'post', params);
};

const deactivatePromotion = (shopId, promotionId, body) => {
  return callApi(`/shops/${shopId}/promotions/${promotionId}/deactivate`, 'post', body);
};

const editOrUpdatePromotion = (id, params) => {
  return callApi(`/admin/v1/promotions/${id}`, 'patch', params);
};

const listProductNoDiscount = (shopId) => {
  return callApi(`/shops/${shopId}/promotions/list_unpromotion`, 'get');
};

const listProductNoFlashDeal = (shopId) => {
  return callApi(`/shops/${shopId}/promotions/list_unpromotion_sku`, 'get');
};

const createFlashDeal = (shopId, params) => {
  return callApi(`/shops/${shopId}/promotions/create_flashsale`, 'post', params);
};

const InactivePromotion = (shopId, params) => {
  return callApi(`/shops/${shopId}/promotions/deactive_promotion`, 'post', params);
};

export const promotions = {
  getPromotions,
  getPromotionDetail,
  createPromotion,
  deactivatePromotion,
  editOrUpdatePromotion,
  listProductNoDiscount,
  listProductNoFlashDeal,
  createFlashDeal,
  InactivePromotion,
};
