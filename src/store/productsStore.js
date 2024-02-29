import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useProductsStore = create((set, get) => ({
  products: [],
  productById: {},
  infoTable: {},
  newProduct: {},
  loading: false,
  getAllProducts: async (id, page_number,onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.getAllProducts(id,page_number)
      set({ products: [...get().products,...response.data.data.products] })
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
      if (error?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category')
      } else {
        onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!')
      }
    }
    set({ loading: false })
  },
  editProduct: async(shopId, productId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.editProduct(shopId, productId, body)
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi sửa sản phẩm!')
    }
    set({ loading: false })
  },
  createOneProduct: async(shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.createOneProduct(shopId, body)
      set({ newProduct: response.data.data })
      onSuccess(response.data)
    } catch (error) {
      if (error?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category')
      } else {
        onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!')
      }
    }
    set({ loading: false })
  },
  createOneProductDraff: async(shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.products.createOneProductDraff(shopId, body)
      set({ newProduct: response.data })
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra khi tạo sản phẩm nháp!')
    }
    set({ loading: false })
  },
  resetProductById: () => {
    set({ productById: {} })
  }
}))
