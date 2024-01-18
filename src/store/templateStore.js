import { create } from "zustand";
import { RepositoryRemote } from "../services";

// tạo các hàm get all thêm sửa xoá cho template
export const useTemplateStore = create((set) => ({
  templates: {},
  templateById: {},
  loading: false,
  getAllTemplate: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getAllTemplate();
      set({ templates: response.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading:  false });
  },
  getTemplateById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.getTemplateById(id);
      set({ templateById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  createTemplate: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.createTemplate(params);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateTemplate: async (
    id,
    params,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.updateTemplate(
        id,
        params
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  deleteTemplate: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.template.deleteTemplate(id);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
