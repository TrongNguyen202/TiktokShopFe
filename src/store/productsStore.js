import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useProductsStore = create((set) => ({
  products: {},
  productById: {},
  infoTable: {},
  newProduct: {},
  loading: false,
  getAllProducts: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.getAllProducts(id)
      set({ products: response.data.data.products })
      set({ infoTable: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  getProductsById: async (shopId, productId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.getProductsById(shopId, productId)
      set({ productById: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  changeStatusProduct: async (id, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      RepositoryRemote.products.changeStatusProduct(id, params)
      onSuccess()
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  createProductList: async (shopId, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.createProductList(shopId, params)
      onSuccess()
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  editProduct: async(shopId, productId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.editProduct(shopId, productId, body)
      set({ products: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  createOneProduct: async(shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.createOneProduct(shopId, body)
      set({ newProduct: response.data.data })
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  }
}))
