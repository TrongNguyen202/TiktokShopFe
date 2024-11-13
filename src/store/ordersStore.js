import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useOrdersStore = create((set) => ({
  users: {},
  packages: {},
  loading: false,
  loadingAllPackages: false,
  getUserGroup: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getUserGroup()
      set({ users: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },

  getAllPackages: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingAllPackages: true })
      const response = await RepositoryRemote.orders.getAllPackages(params)
      set({ packages: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loadingAllPackages: false })
  },
}))
