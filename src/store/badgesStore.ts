import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface BadgesStore {
  badges: Record<string, unknown>;
  loading: boolean;
  getAllBadges: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useBadgesStore = create<BadgesStore>((set) => ({
  badges: {},
  loading: false,
  getAllBadges: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.badges.getAllBadges();
      localStorage.setItem('badges', JSON.stringify(response?.data.data));
      set({ badges: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error: any) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
