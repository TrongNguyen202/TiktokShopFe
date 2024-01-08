import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useWareHousesStore = create((set) => ({
  warehousesById: {},
  loadingWerehouses: false,
  getWarehousesByShopId: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingWerehouses: true })
      const response = await RepositoryRemote.warehouses.getWarehousesByShopId(id)
      set({ warehousesById: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loadingWerehouses: false })
  }
}))
