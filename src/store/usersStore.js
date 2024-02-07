import { create } from 'zustand'
import { RepositoryRemote } from '../services'
import { alerts } from '../utils/alerts'

export const useUsersStore = create((set) => ({
  shopsByUser: {},
  loading: false,
  getShopByUser: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.users.getShopByUser()
      if(response?.data?.code === 12052700) {
        alerts.error(response?.data?.message)
        Promise.reject({error: response?.data?.message})
      }
      set({ brands: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu shop!')
    }
    set({ loading: false })
  },
}))
