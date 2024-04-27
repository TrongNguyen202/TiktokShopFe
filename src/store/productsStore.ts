import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';
import { handleAxiosError } from '../utils/handleAxiosError';

interface ProductsStore {
  products: Record<string, unknown>[];
  productById: any;
  infoTable: any;
  newProduct: Record<string, unknown>;
  loading: boolean;
  loadingImage: boolean;
  getAllProducts: (
    id: string,
    page_number: number,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  clearProducts: () => void;
  getProductsById: (
    shopId: string,
    productId: string,
    onSuccess?: (data: any) => void,
    onFail?: (data: any) => void,
  ) => void;
  changeStatusProduct: (
    id: string,
    params: Record<string, unknown>,
    onSuccess: () => void,
    onFail: (data: any) => void,
  ) => void;
  createProductList: (
    shopId: string,
    params: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  editProduct: (
    shopId: string,
    productId: string,
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  createOneProduct: (
    shopId: string,
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  createOneProductDraff: (
    shopId: string,
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  resetProductById: () => void;
  changeProductImageToWhite: (
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  removeProduct: (
    shopId: string,
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
}

export const useProductsStore = create<ProductsStore>((set, get: any) => ({
  products: [],
  productById: {},
  infoTable: {},
  newProduct: {},
  loading: false,
  loadingImage: false,
  getAllProducts: async (id, page_number, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.getAllProducts(id, page_number);
      if (response?.data.message === 'seller is inactivated') {
        alerts.error('seller is inactivated');
        return;
      }
      set({ products: [...get().products, ...(response?.data.data.products ?? [])] });
      set({ infoTable: response?.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  clearProducts: () => {
    set({ products: [] });
  },
  getProductsById: async (shopId, productId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.getProductsById(shopId, productId);
      set({ productById: response?.data.data });
      if (onSuccess) onSuccess(response?.data.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  changeStatusProduct: async (id, params, onSuccess, onFail) => {
    try {
      set({ loading: true });
      RepositoryRemote.products.changeStatusProduct(id, params);
      onSuccess();
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createProductList: async (shopId, params, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.createProductList(shopId, params);
      onSuccess(response?.data);
    } catch (error) {
      if ((error as any)?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category');
      } else {
        onFail((error as any)?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!');
      }
    }
    set({ loading: false });
  },
  editProduct: async (shopId, productId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.editProduct(shopId, productId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createOneProduct: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.createOneProduct(shopId, body);
      set({ newProduct: response?.data.data });
      onSuccess(response?.data);
    } catch (error) {
      if ((error as any)?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category');
      } else {
        onFail((error as any)?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!');
      }
    }
    set({ loading: false });
  },
  createOneProductDraff: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.createOneProductDraff(shopId, body);
      set({ newProduct: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  resetProductById: () => {
    set({ productById: {}, infoTable: {} });
  },

  changeProductImageToWhite: async (body, onSuccess, onFail) => {
    try {
      set({ loadingImage: true });
      const response = await RepositoryRemote.products.changeProductImageToWhite(body);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingImage: false });
  },

  removeProduct: async (shopId, body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.removeProduct(shopId, body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
