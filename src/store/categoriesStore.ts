import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface CategoriesStore {
  categories: Record<string, unknown>;
  categoriesIsLeaf: Record<string, unknown>[];
  categoriesIsLeafType2: Record<string, unknown>[];
  categoriesById: Record<string, unknown>;
  infoTable: Record<string, unknown>;
  attributes: Record<string, unknown>[];
  loading: boolean;
  loadingById: boolean;
  attributeLoading: boolean;
  getAllCategories: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getAllCategoriesIsLeaf: (onSuccess?: (data: any) => void, onFail?: (data: any) => void) => void;
  getAllCategoriesIsLeafType2: (shopId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getCategoriesById: (id: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getAttributeByCategory: (
    shopId: string,
    categoryId: string,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  resetCategoryData: () => void;
  recommendCategory: (
    shopId: string,
    data: Record<string, unknown>,
    onSuccess?: (data: any) => void,
    onFail?: (data: any) => void,
  ) => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: {},
  categoriesIsLeaf: [],
  categoriesIsLeafType2: [],
  categoriesById: {},
  infoTable: {},
  attributes: [],
  loading: false,
  loadingById: false,
  attributeLoading: false,
  getAllCategories: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.getAllCategories();
      set({ categories: response?.data.data.data });
      set({ infoTable: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getAllCategoriesIsLeaf: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.getAllCategoriesIsLeaf();
      set({ categoriesIsLeaf: response?.data.data.category_list });
      if (onSuccess) onSuccess(response?.data.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getAllCategoriesIsLeafType2: async (shopId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.getAllCategoriesIsLeafType2(shopId);
      set({ categoriesIsLeafType2: response?.data.data });
      set({ infoTable: response?.data.category_list });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getCategoriesById: async (id, onSuccess, onFail) => {
    try {
      set({ loadingById: true });
      const response = await RepositoryRemote.categories.getCategoriesById(id);
      set({ categoriesById: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingById: false });
  },
  getAttributeByCategory: async (shopId, categoryId, onSuccess, onFail) => {
    try {
      set({ attributeLoading: true });
      const response = await RepositoryRemote.categories.getAttributeByCategory(shopId, categoryId);
      set({ attributes: response?.data.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ attributeLoading: false });
  },
  resetCategoryData: () => {
    set({ categories: {} });
    set({ categoriesIsLeaf: [] });
    set({ categoriesIsLeafType2: [] });
    set({ categoriesById: {} });
    set({ infoTable: {} });
    set({ attributes: [] });
  },
  recommendCategory: async (shopId, data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.recommendCategory(shopId, data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
