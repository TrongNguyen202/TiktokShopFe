import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface ShopsStore {
  stores: Record<string, unknown>[];
  storeById: Record<string, unknown>;
  infoTable: Record<string, unknown>;
  loading: boolean;
  getAllStores: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  createStore: (data: Record<string, unknown>, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getStoreById: (id: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  updateStore: (
    id: string,
    data: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  searchStores: (query: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  refreshToken: (ShopId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useShopsStore = create<ShopsStore>((set, get: any) => ({
  stores: [],
  storeById: {},
  infoTable: {},
  loading: false,
  getAllStores: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.stores.getAllStores();
      set({ stores: response?.data });
      set({ infoTable: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createStore: async (data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.stores.createStore(data);
      // set({ stores: response?.data.data })
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getStoreById: async (id, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.stores.getStoreById(id);
      set({ storeById: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  updateStore: async (id, data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.stores.updateStore(id, data);
      const index = get().stores.findIndex((item: Record<string, unknown>) => item.id === id);
      const newStores = [...get().stores];
      newStores[index] = response?.data;
      set({ stores: newStores });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  searchStores: async (query, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.stores.searchStores(query);
      set({ stores: response?.data.data.data });
      set({ infoTable: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  refreshToken: async (ShopId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.stores.refreshToken(ShopId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
