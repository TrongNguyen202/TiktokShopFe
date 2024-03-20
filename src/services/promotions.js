import { callApi } from '../apis';

const getPromotions = (id, pageNumber) => {
  return callApi(`/shops/${id}/promotions?page_number=${pageNumber}`, 'get');
};

const getPromotionDetail = (shopId, promotionId) => {
  return callApi(`/shops/${shopId}/promotions/${promotionId}`, 'get');
};

const createPromotion = (shopId, params) => {
  return callApi(`/shops/${shopId}/promotions/create`, 'post', params);
};

const deactivatePromotion = (shopId, promotionId, body) => {
  return callApi(`/shops/${shopId}/promotions/${promotionId}/deactivate`, 'post', body);
};

const editOrUpdatePromotion = (id, params) => {
  return callApi(`/admin/v1/promotions/${id}`, 'patch', params);
};

export const promotions = {
  getPromotions,
  getPromotionDetail,
  createPromotion,
  deactivatePromotion,
  editOrUpdatePromotion,
};
