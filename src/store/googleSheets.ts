import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface GoogleStore {
  sheets: Record<string, unknown>;
  loading: boolean;
  getAllSheetInfo: (range: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  AddRowToSheet: (
    range: string,
    query: Record<string, unknown>,
    oauthAccessToken: string,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
}

export const useGoogleStore = create<GoogleStore>((set) => ({
  sheets: {},
  loading: false,
  getAllSheetInfo: async (range, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.google.getAllSheetInfo(range);
      set({ sheets: response.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  AddRowToSheet: async (range, query, oauthAccessToken: string, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.google.AddRowToSheet(range, query, oauthAccessToken);
      set({ sheets: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
