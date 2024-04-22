import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

// tạo các hàm get all thêm sửa xoá cho template
export const useTemplateStore = create((set) => ({
  templates: [],
  designTemplates: [],
  templateById: {},
  loading: false,
  getAllTemplate: async (onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getAllTemplate();
      set({ templates: response?.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getTemplateById: async (id: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getTemplateById(id);
      set({ templateById: response.data.data });
      onSuccess(response?.data.data);
    } catch (error: any) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createTemplate: async (
    params: Record<string, unknown>,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.createTemplate(params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  updateTemplate: async (
    id: string,
    params: Record<string, unknown>,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.updateTemplate(id, params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  deleteTemplate: async (id: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.deleteTemplate(id);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getAllDesignTemplate: async (onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getAllDesignTemplate();
      set({ designTemplates: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createDesignTemplate: async (
    params: Record<string, unknown>,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.createDesignTemplate(params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  updateDesignTemplate: async (
    id: string,
    params: Record<string, unknown>,
    onSuccess = (data: any) => {},
    onFail = (data: any) => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.updateDesignTemplate(id, params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  deleteDesignTemplate: async (id: string, onSuccess = (data: any) => {}, onFail = (data: any) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.deleteDesignTemplate(id);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
