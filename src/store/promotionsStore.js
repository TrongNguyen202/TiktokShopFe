import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';
import { promotions } from '../services/promotions';

export const usePromotionsStore = create((set, get) => ({
  promotions: [],
  loading: false,
  getPromotions: async (shopId, pageNumber, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const { data } = await RepositoryRemote.promotions.getPromotions(shopId, pageNumber);
      if (data.success === false) {
        alerts.error(data.message);
        return;
      }

      set({ promotions: [...get().promotions, data.promotion_list] });

      console.log(data.promotion_list);

      onSuccess(promotions);
    } catch (error) {
      onFail(error || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getPromotionDetail: async (shopId, productId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.getPromotionDetail(shopId, productId);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  createPromotion: async (shopId, promotionData, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.createPromotion(shopId, promotionData);
      onSuccess(response.data);
    } catch (error) {
      if (error?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category');
      } else {
        onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!');
      }
    }
    set({ loading: false });
  },
}));