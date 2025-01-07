import { create } from 'zustand'
import { RepositoryRemote } from '../services'

export const useOrdersStore = create((set) => ({
  users: {},
  packages: {},
  loading: false,
  loadingAllPackages: false,
  loadingProductPackage: false,
  podVariants:[],
  ckfVariants:[],
  shops:[],
  getFlashShipVariants: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      // console.log("hello")
      set({ loading: true })
      const response = await RepositoryRemote.orders.getFlashShipPodVariants()
      set({ podVariants: response.data })
      onSuccess(response.data)
      // console.log("response", response)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  getCkfVariants: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getCkfPodVariants()
      set({ ckfVariants: response.data })
      onSuccess(response.data)
      console.log("response", response)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },

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
  getUserShops: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getUserShop()
      set({ shops: response.data.shops })
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!')
    }
    set({ loading: false })
  },
  getUserInfor: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true })
      const response = await RepositoryRemote.orders.getCurrentUserInfor()
      // set({ shops: response.data.shops })
      onSuccess(response.data)
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
  updateProductPackage: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      console.log("Starting updateProductPackage with ID:", id);
      console.log("Body:", body);
      set({ loadingProductPackage: true });
      const response = await RepositoryRemote.orders.updateProductPackage(id, body);
      console.log("Update response:", response);
      onSuccess(response.data.data);
    } catch (error) {
      console.error("Update failed:", error);
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingProductPackage: false });
  },

  updatePackageStatus: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      console.log("Starting updatePackageStatus with ID:", id);
      console.log("Body:", body);
      set({ loading: true });
      const response = await RepositoryRemote.orders.updatePackageStatus(id, body);
      console.log("Update response:", response);
      onSuccess(response.data.data);
    } catch (error) {
      console.error("Update failed:", error);
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  updateFulfillmentName: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      console.log("Starting updateFulfillmentName with ID:", id);
      console.log("Body:", body);
      set({ loading: true });
      const response = await RepositoryRemote.orders.updateFulfillmentName(id, body);
      console.log("Update response:", response);
      onSuccess(response.data.data);
    } catch (error) {
      console.error("Update failed:", error);
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getPackageNumberSortMax : async (onSuccess = () => {}, onFail = () => {})=>{
    try {
      console.log("Starting getPackageNumberSortMax");
      // set({ loadingPackageNumberSortMax: true });
      const response = await RepositoryRemote.orders.getPackageNumberSortMax();
      console.log("Get response:", response);
      onSuccess(response?.data?.data);
      } catch (error) {
        console.error("Get failed:", error);
        onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
        }
  }
}))
