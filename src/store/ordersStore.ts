import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface ShopsOrder {
  orders: any[];
  labels: any[];
  toShipInfo: any[];
  combineList: any[];
  shippingServiceInfo: any[];
  loading: boolean;
  loadingGetInfo: boolean;
  loadingUpload: boolean;
  loadingFulfillment: boolean;
  loadingGetLink: boolean;
  loadingRejectOrder: boolean;
  cancelTokenSource: any;
  packageBought: any[];
  getAllOrders: (id: string, onSuccess?: (data: any) => void, onFail?: (data: any) => void) => void;
  getLabelsById: (orderId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  uploadLabelToDriver: (data: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getToShipInfo: (shopId: string, data: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getAllCombine: (shopId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  confirmCombine: (shopId: string, body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  createLabel: (shopId: string, body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  shippingService: (shopId: string, body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  buyLabel: (shopId: string, body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getShippingDoc: (id: string, body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getPackageBought: (onSuccess?: (data: any) => void, onFail?: (data: any) => void) => void;
  pdfLabelSearch: (packageId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  pdfLabelLinkSearch: (body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  pdfLabelDownload: (fileName: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getDesignSku: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getDesignSkuSize: (page: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getDesignSkuByGroup: (groupId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getDesignSkuByGroupSize: (
    groupId: string,
    page: string,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  postDesignSku: (data: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  putDesignSku: (data: any, designId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  deleteDesignSku: (designId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  searchDesignSku: (body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getDesignSkuById: (skuId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  packageCreateFlashShip: (
    shopId: string,
    body: any,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  packageCreatePrintCare: (
    shopId: string,
    body: string,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  packageFulfillmentCompleted: (shopId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  packageFulfillmentCompletedInActive: (packageId: string, body: any) => void;
  cancelOrder: (shopId: string, body: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useShopsOrder = create<ShopsOrder>((set) => ({
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
  getAllOrders: async (id, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getAllOrders(id);
      set({ orders: response?.data.data });
      if (onSuccess) onSuccess(response?.data.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getLabelsById: async (orderId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getLabelsById(orderId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  uploadLabelToDriver: async (data, onSuccess, onFail) => {
    try {
      set({ loadingUpload: true });
      const response = await RepositoryRemote.orders.uploadLabelToDriver(data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingUpload: false });
  },
  getToShipInfo: async (shopId, data, onSuccess, onFail) => {
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

  getAllCombine: async (shopId, onSuccess, onFail) => {
    try {
      const response = await RepositoryRemote.orders.getAllCombine(shopId);
      set({ combineList: response?.data.data.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  confirmCombine: async (shopId, body, onSuccess, onFail) => {
    try {
      const response = await RepositoryRemote.orders.confirmCombine(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  createLabel: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.createLabel(shopId, body);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  shippingService: async (shopId, body, onSuccess, onFail) => {
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

  buyLabel: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.buyLabel(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getShippingDoc: async (id, body, onSuccess, onFail) => {
    try {
      set({ loadingFulfillment: true });
      const response = await RepositoryRemote.orders.getShippingDoc(id, body);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingFulfillment: false });
  },

  getPackageBought: async (onSuccess, onFail) => {
    try {
      const response = await RepositoryRemote.orders.getPackageBought();
      set({ packageBought: response?.data });
      if (onSuccess) onSuccess(response?.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
  },
  pdfLabelSearch: async (packageId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.pdfLabelSearch(packageId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  pdfLabelLinkSearch: async (body, onSuccess, onFail) => {
    try {
      set({ loadingGetLink: true });
      const response = await RepositoryRemote.orders.pdfLabelLinkSearch(body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingGetLink: false });
  },

  pdfLabelDownload: async (fileName, onSuccess, onFail) => {
    try {
      const response = await RepositoryRemote.orders.pdfLabelDownload(fileName);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  getDesignSku: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSku();
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuSize: async (page, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuSize(page);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuByGroup: async (groupId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuByGroup(groupId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuByGroupSize: async (groupId, page, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuByGroupSize(groupId, page);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  postDesignSku: async (data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.postDesignSku(data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  putDesignSku: async (data, designId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.putDesignSku(data, designId);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  deleteDesignSku: async (designId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.deleteDesignSku(designId);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  searchDesignSku: async (body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.searchDesignSku(body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getDesignSkuById: async (skuId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getDesignSkuById(skuId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageCreateFlashShip: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageCreateFlashShip(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageCreatePrintCare: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageCreatePrintCare(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageFulfillmentCompleted: async (shopId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.packageFulfillmentCompleted(shopId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  packageFulfillmentCompletedInActive: async (packageId, body) => {
    try {
      set({ loading: true });
      await RepositoryRemote.orders.packageFulfillmentCompletedInActive(packageId, body);
    } catch (error) {
      console.log('error: ', error);
    }
    set({ loading: false });
  },

  cancelOrder: async (shopId, body, onSuccess, onFail) => {
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
