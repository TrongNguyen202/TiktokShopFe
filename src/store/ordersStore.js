import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useShopsOrder = create((set) => ({
  orders: [],
  labels: [],
  toShipInfo: [],
  combineList: [],
  shippingServiceInfo: [],
  loading: false,
  loadingGetInfo: false,
  cancelTokenSource: null,
  packageBought: [],
  getAllOrders: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getAllOrders(id);
      set({ orders: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getLabelsById: async (orderId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getLabelsById(orderId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  uploadLabelToDriver: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.uploadLabelToDriver(data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getToShipInfo: async (shopId, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingGetInfo: true });
      const response = await RepositoryRemote.orders.getToShipInfo(shopId, data);
      set({ toShipInfo: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingGetInfo: false });
  },

  getAllCombine: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.getAllCombine(shopId);
      set({ combineList: response.data.data.data });
      onSuccess(response.data);
    } catch (error) {
      console.log('error: ', error);
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  confirmCombine: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.confirmCombine(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  createLabel: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.createLabel(shopId, body);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  shippingService: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.shippingService(shopId, body);
      set({ shippingServiceInfo: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  buyLabel: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.buyLabel(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getShippingDoc: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getShippingDoc(id, body);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getPackageBought: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getPackageBought();
      set({ packageBought: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  pdfLabelSearch: async (packageId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.pdfLabelSearch(packageId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  pdfLabelDownload: async (fileName, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.pdfLabelDownload(fileName);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  getDesignSku: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSku();
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuSize: async (page, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuSize(page);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuByGroup: async (groupId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuByGroup(groupId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuByGroupSize: async (groupId, page, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuByGroupSize(groupId, page);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  postDesignSku: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.postDesignSku(data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  putDesignSku: async (data, DesignId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.putDesignSku(data, DesignId);
      console.log(response);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  deleteDesignSku: async (DesignId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.deleteDesignSku(DesignId);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  searchDesignSku: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.searchDesignSku(body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
}));
