import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';
import { handleAxiosError } from '../utils/handleAxiosError';

interface ShopsStore {
  brands: Record<string, unknown>[];
  loading: boolean;
  getAllBrand: (id: string, onSuccess?: (data: any) => void, onFail?: (data: any) => void) => void;
}

export const useShopsBrand = create<ShopsStore>((set) => ({
  brands: [],
  loading: false,
  getAllBrand: async (id, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.brand.getAllBrand(id);
      if (response?.data?.code === 12052700) {
        alerts.error(response?.data?.message);
        Promise.reject(new Error(response?.data?.message));
      }
      set({ brands: response?.data.data });
      if (onSuccess) onSuccess(response?.data.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
