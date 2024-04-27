import { callApi } from '../apis';

const getPromotions = (id: string, pageNumber: number, searchValue: string, filterStatus: string) => {
  return callApi(
    `/shops/${id}/promotions?page_number=${pageNumber}&title=${searchValue}${filterStatus && filterStatus !== 'all' ? `&status=${filterStatus}` : ''}`,
    'get',
  );
};

const getPromotionDetail = (shopId: string, promotionId: string) => {
  return callApi(`/shops/${shopId}/promotions/${promotionId}`, 'get');
};

const createPromotion = (shopId: string, params: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/promotions/create_discount`, 'post', params);
};

const deactivatePromotion = (shopId: string, promotionId: string, body: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/promotions/${promotionId}/deactivate`, 'post', body);
};

const editOrUpdatePromotion = (id: string, params: Record<string, unknown>) => {
  return callApi(`/admin/v1/promotions/${id}`, 'patch', params);
};

const listProductNoDiscount = (shopId: string) => {
  return callApi(`/shops/${shopId}/promotions/list_unpromotion`, 'get');
};

const listProductNoFlashDeal = (shopId: string) => {
  return callApi(`/shops/${shopId}/promotions/list_unpromotion_sku`, 'get');
};

const createFlashDeal = (shopId: string, params: Record<string, unknown>) => {
  return callApi(`/shops/${shopId}/promotions/create_flashsale`, 'post', params);
};

const InactivePromotion = (shopId: string, params: Record<string, unknown>) => {
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
