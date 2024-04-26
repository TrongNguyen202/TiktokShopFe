import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface UsersStore {
  shopsByUser: Record<string, unknown>[];
  loading: boolean;
  getShopByUser: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getUserInfo: (userId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  updateUser: (data: Record<string, unknown>, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  createUser: (data: Record<string, unknown>, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getGroupUser: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
}

export const useUsersStore = create<UsersStore>((set, get: any) => ({
  shopsByUser: [],
  loading: false,
  getShopByUser: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.getShopByUser();
      set({ shopsByUser: response?.data.data });
      onSuccess(response?.data.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getUserInfo: async (userId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.getUserInfo(userId);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  updateUser: async (data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.updateUser(data);
      const userId = data?.user_id;
      const newShopsByUser = get().shopsByUser;
      const index = newShopsByUser.users.findIndex((item: Record<string, unknown>) => item.user_id === userId);
      newShopsByUser.users[index] = data;
      console.log('newShopsByUser: ', newShopsByUser);
      set({ shopsByUser: newShopsByUser });
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  createUser: async (data, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.createUser(data);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  getGroupUser: async (onSuccess, onFail) => {
    try {
      const response = await RepositoryRemote.users.getGroupUser();
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },
}));
