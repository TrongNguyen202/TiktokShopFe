import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';

export const useShopsBrand = create((set) => ({
  brands: {},
  loading: false,
  getAllBrand: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.brand.getAllBrand(id);
      if (response?.data?.code === 12052700) {
        alerts.error(response?.data?.message);
        Promise.reject(new Error(response?.data?.message));
      }
      set({ brands: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu brand!');
    }
    set({ loading: false });
  },
}));
