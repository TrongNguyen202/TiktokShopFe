import { create } from 'zustand';
import { AxiosError } from 'axios';
import { RepositoryRemote } from '../services';

export const useBadgesStore = create((set) => ({
  badges: {},
  loading: false,
  getAllBadges: async (onSuccess = (data: any) => {}, onFail = (data: string) => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.badges.getAllBadges();
      localStorage.setItem('badges', JSON.stringify(response?.data.data));
      set({ badges: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
      } else {
        onFail(error.message || 'Có lỗi xảy ra!');
      }
    }
    set({ loading: false });
  },
}));
