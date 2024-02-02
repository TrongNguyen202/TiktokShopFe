import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useShopsOrder = create((set) => ({
  orders: [],
  labels: [],
  toShipInfo: [],
  loading: false,
  loadingGetInfo: false,
  getAllOrders: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getAllOrders(id)
      set({ orders: response.data.data.order_list })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  buyLabels: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.buyLabels(id, body)
      set({ labels: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  getLabelsById: async (orderId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getLabelsById(orderId)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  uploadLabelToDriver: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.uploadLabelToDriver(data)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  getToShipInfo: async (shopId, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingGetInfo: true })
      const response = await RepositoryRemote.orders.getToShipInfo(shopId, data)
      set({ toShipInfo: response.data })
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loadingGetInfo: false })
  },
}))
