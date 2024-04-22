import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

export const useShopsOrder = create((set) => ({
  orders: [],
  labels: [],
  toShipInfo: [],
  combineList: [],
  shippingServiceInfo: [],
  loading: false,
  loadingGetInfo: false,
  loadingUpload: false,
  loadingFulfillment: false,
  loadingGetLink: false,
  loadingRejectOrder: false,
  cancelTokenSource: null,
  packageBought: [],
  getAllOrders: async (id: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getAllOrders(id);
      set({ orders: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getLabelsById: async (orderId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getLabelsById(orderId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  uploadLabelToDriver: async (data: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loadingUpload: true });
      const response = await RepositoryRemote.orders.uploadLabelToDriver(data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingUpload: false });
  },
  getToShipInfo: async (shopId: string, data: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loadingGetInfo: true });
      const response = await RepositoryRemote.orders.getToShipInfo(shopId, data);
      set({ toShipInfo: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingGetInfo: false });
  },

  getAllCombine: async (shopId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      const response = await RepositoryRemote.orders.getAllCombine(shopId);
      set({ combineList: response?.data.data.data });
      onSuccess(response?.data);
    } catch (error) {
      console.log('error: ', error);
      onFail(handleAxiosError(error));
    }
  },

  confirmCombine: async (shopId: string, body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      const response = await RepositoryRemote.orders.confirmCombine(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  createLabel: async (shopId: string, body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.createLabel(shopId, body);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  shippingService: async (shopId: string, body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.shippingService(shopId, body);
      set({ shippingServiceInfo: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  buyLabel: async (shopId: string, body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.buyLabel(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getShippingDoc: async (id: string, body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loadingFulfillment: true });
      const response = await RepositoryRemote.orders.getShippingDoc(id, body);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingFulfillment: false });
  },

  getPackageBought: async (onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      const response = await RepositoryRemote.orders.getPackageBought();
      set({ packageBought: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  pdfLabelSearch: async (packageId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.pdfLabelSearch(packageId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  pdfLabelLinkSearch: async (body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loadingGetLink: true });
      const response = await RepositoryRemote.orders.pdfLabelLinkSearch(body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingGetLink: false });
  },

  pdfLabelDownload: async (fileName: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      const response = await RepositoryRemote.orders.pdfLabelDownload(fileName);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  getDesignSku: async (onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSku();
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuSize: async (page: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuSize(page);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuByGroup: async (groupId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuByGroup(groupId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuByGroupSize: async (
    groupId: string,
    page: string,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuByGroupSize(groupId, page);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  postDesignSku: async (data: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.postDesignSku(data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  putDesignSku: async (data: any, designId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.putDesignSku(data, designId);
      console.log(response);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  deleteDesignSku: async (designId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.deleteDesignSku(designId);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  searchDesignSku: async (body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.searchDesignSku(body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuById: async (skuId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuById(skuId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageCreateFlashShip: async (
    shopId: string,
    body: any,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageCreateFlashShip(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageCreatePrintCare: async (
    shopId: string,
    body: string,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageCreatePrintCare(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageFulfillmentCompleted: async (shopId: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageFulfillmentCompleted(shopId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageFulfillmentCompletedInActive: async (
    packageId: string,
    body: any,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageFulfillmentCompletedInActive(packageId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  cancelOrder: async (shopId: string, body: any, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loadingRejectOrder: true });
      const response = await RepositoryRemote.orders.cancelOrder(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingRejectOrder: false });
  },
}));
