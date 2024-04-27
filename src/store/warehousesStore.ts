import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface WareHousesStore {
  warehousesById: any;
  loadingWarehouse: boolean;
  loading: boolean;
  getWarehousesByShopId: (id: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useWareHousesStore = create<WareHousesStore>((set) => ({
  warehousesById: {},
  loading: false,
  loadingWarehouse: false,
  getWarehousesByShopId: async (id, onSuccess, onFail) => {
    try {
      set({ loadingWarehouse: true });
      const response = await RepositoryRemote.warehouses.getWarehousesByShopId(id);
      set({ warehousesById: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingWarehouse: false });
  },
}));
