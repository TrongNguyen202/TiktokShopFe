import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useWareHousesStore = create((set) => ({
  warehousesById: [],
  loadingWarehouse: false,
  getWarehousesByShopId: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingWarehouse: true });
      const response = await RepositoryRemote.warehouses.getWarehousesByShopId(id);
      set({ warehousesById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu warehouse!');
    }
    set({ loadingWarehouse: false });
  },
}));
