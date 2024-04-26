import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface SellersStore {
  sellers: Record<string, unknown>;
  sellerById: Record<string, unknown>;
  infoTable: Record<string, unknown>;
  loading: boolean;
  loadingById: boolean;
  getAllSellers: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getSellersById: (id: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  searchSeller: (query: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useSellersStore = create<SellersStore>((set) => ({
  sellers: {},
  sellerById: {},
  infoTable: {},
  loading: false,
  loadingById: false,
  getAllSellers: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.sellers.getAllSellers();
      set({ sellers: response?.data.data.data });
      set({ infoTable: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getSellersById: async (id, onSuccess, onFail) => {
    try {
      set({ loadingById: true });
      const response = await RepositoryRemote.sellers.getSellersById(id);
      set({ sellerById: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingById: false });
  },
  searchSeller: async (query, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.sellers.searchSeller(query);
      set({ sellers: response?.data.data.data });
      set({ infoTable: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
