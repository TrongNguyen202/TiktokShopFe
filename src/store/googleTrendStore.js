import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useGoogleTrendStore = create((set) => ({
  googleTrendsOptions: {},
  loading: false,
  loadingCrawl: false,
  getGoogleTrendOptions: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.googleTrends.getGoogleTrendOptions();
      set({ googleTrendsOptions: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getGoogleTrendData: async (query, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingCrawl: true });
      const response = await RepositoryRemote.googleTrends.getGoogleTrendData(query);
      onSuccess(response.data);
    } catch (error) {
      onFail(error || 'Có lỗi xảy ra!');
    }
    set({ loadingCrawl: false });
  },
}));
