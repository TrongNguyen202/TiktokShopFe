import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface GoogleTrendStore {
  googleTrendsOptions: Record<string, unknown>;
  loading: boolean;
  loadingCrawl: boolean;
  getGoogleTrendOptions: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getGoogleTrendData: (query: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useGoogleTrendStore = create<GoogleTrendStore>((set) => ({
  googleTrendsOptions: {},
  loading: false,
  loadingCrawl: false,
  getGoogleTrendOptions: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.googleTrends.getGoogleTrendOptions();
      set({ googleTrendsOptions: response?.data });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getGoogleTrendData: async (query, onSuccess, onFail) => {
    try {
      set({ loadingCrawl: true });
      const response = await RepositoryRemote.googleTrends.getGoogleTrendData(query);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loadingCrawl: false });
  },
}));
