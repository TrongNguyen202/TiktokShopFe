import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useShopsOrder = create((set) => ({
  orders: [],
  loading: false,
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
}))
