import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useFlashShipStores = create((set) => ({
  ordersFlashShip: [],
  createOrderFlashShip: async (body, onSuccess = () => { }, onFail = () => { }) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.google.createOrderFlashShip(body)
      set({ ordersFlashShip: response.data})
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
}))
