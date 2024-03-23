import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useGoogleTrendStore = create((set) => ({
  googleTrendsOptions: {},
  loading: false,
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
}));
