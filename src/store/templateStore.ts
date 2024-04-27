import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';
import { TemplateItem } from '../types/templateItem';
import { DesignTemplates } from '../types/designTemplate';

interface TemplateStore {
  templates: TemplateItem[];
  designTemplates: DesignTemplates[];
  templateById: Record<string, unknown>;
  loading: boolean;
  getAllTemplate: (onSuccess?: (data?: any) => void, onFail?: (data?: any) => void) => void;
  createTemplate: (
    params: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  updateTemplate: (
    id: string,
    params: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  deleteTemplate: (id: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getAllDesignTemplate: (onSuccess?: (data: any) => void, onFail?: (data: any) => void) => void;
  createDesignTemplate: (
    params: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  updateDesignTemplate: (
    id: string,
    params: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  deleteDesignTemplate: (id: number, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  designTemplates: [],
  templateById: {},
  loading: false,
  getAllTemplate: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getAllTemplate();
      set({ templates: response?.data });
      if (onSuccess) onSuccess(response?.data.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createTemplate: async (params, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.createTemplate(params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  updateTemplate: async (id, params, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.updateTemplate(id, params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  deleteTemplate: async (id, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.deleteTemplate(id);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getAllDesignTemplate: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getAllDesignTemplate();
      set({ designTemplates: response?.data });
      if (onSuccess) onSuccess(response?.data);
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createDesignTemplate: async (params, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.createDesignTemplate(params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  updateDesignTemplate: async (id, params, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.updateDesignTemplate(id, params);
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  deleteDesignTemplate: async (id, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.deleteDesignTemplate(String(id));
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
