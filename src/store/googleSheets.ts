import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useGoogleStore = create((set) => ({
  sheets: {},
  getAllSheetInfo: async (range, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.google.getAllSheetInfo(range);
      set({ sheets: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  AddRowToSheet: async (range, query, oauthAccessToken, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.google.AddRowToSheet(range, query, oauthAccessToken);
      set({ sheets: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
}));
