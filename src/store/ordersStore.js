import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useShopsOrder = create((set) => ({
  orders: [],
  labels: [],
  toShipInfo: [],
  combineList: [],
  shippingServiceInfo: [],
  loading: false,
  loadingGetInfo: false,
  cancelTokenSource: null,
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

  getAllCombine: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.getAllCombine(shopId)
      set({ combineList: response.data.data.data})
      onSuccess(response.data)
    } catch (error) {
      console.log('error: ', error);
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
  },

  confirmCombine: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.confirmCombine(shopId, body)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
  },

  createLabel: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading : true})
      const response = await RepositoryRemote.orders.createLabel(shopId, body)
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading : false})
  },

  shippingService: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading : true})
      const response = await RepositoryRemote.orders.shippingService(shopId, body)
      set({ shippingServiceInfo : response.data })
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading : false})
  },

  buyLabel: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading : true})
      const response = await RepositoryRemote.orders.buyLabel(shopId, body)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading : false})
  },

  getShippingDoc: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getShippingDoc(id, body)
      console.log('response: ', response.data.data);
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
}))
