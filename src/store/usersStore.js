import { create } from 'zustand'
import { RepositoryRemote } from '../services'
import { alerts } from '../utils/alerts'

export const useUsersStore = create((set) => ({
  shopsByUser: [],
  loading: false,
  getShopByUser: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.users.getShopByUser()
      set({ shopsByUser: response.data.data})
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu shop!')
    }
    set({ loading: false })
  },
  getUserInfor: async (userId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.users.getUserInfor(userId)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu user!')
    }
    set({ loading: false })
  },
  updateUser: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.users.updateUser(data)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu user!')
    }
    set({ loading: false })
  },
}))