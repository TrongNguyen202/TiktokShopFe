import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useShopsBrand = create((set) => ({
  brands: {},
  loading: false,
  getAllBrand: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.brand.getAllBrand(id)
      set({ brands: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
}))
