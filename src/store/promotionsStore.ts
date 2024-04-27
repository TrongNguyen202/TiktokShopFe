import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';
import { promotions } from '../services/promotions';
import { handleAxiosError } from '../utils/handleAxiosError';

interface PromotionsStore {
  promotions: Record<string, unknown>[];
  loading: boolean;
  getPromotions: (
    shopId: string,
    pageNumber: number,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  getPromotionDetail: (
    shopId: string,
    productId: string,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  createPromotion: (
    shopId: string,
    promotionData: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  listProductNoDiscount: (shopId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  listProductNoFlashDeal: (shopId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  createFlashDeal: (
    shopId: string,
    data: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  InactivePromotion: (
    shopId: string,
    data: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
}

export const usePromotionsStore = create<PromotionsStore>((set, get: any) => ({
  promotions: [],
  loading: false,
  getPromotions: async (shopId, pageNumber, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.getPromotions(shopId, pageNumber);
      const data = response?.data;
      if (data.success === false) {
        alerts.error(data.message);
        return;
      }

      set({ promotions: [...get().promotions, data.promotion_list] });

      onSuccess(promotions);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getPromotionDetail: async (shopId, productId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.getPromotionDetail(shopId, productId);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createPromotion: async (shopId, promotionData, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.createPromotion(shopId, promotionData);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  listProductNoDiscount: async (shopId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.listProductNoDiscount(shopId);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  listProductNoFlashDeal: async (shopId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.listProductNoFlashDeal(shopId);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  createFlashDeal: async (shopId, data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.createFlashDeal(shopId, data);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  InactivePromotion: async (shopId, data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.InactivePromotion(shopId, data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
