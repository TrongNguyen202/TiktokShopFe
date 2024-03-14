import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';

export const useUsersStore = create((set, get) => ({
  shopsByUser: [],
  loading: false,
  getShopByUser: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.getShopByUser();
      set({ shopsByUser: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu shop!');
    }
    set({ loading: false });
  },
  getUserInfor: async (userId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.getUserInfor(userId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu user!');
    }
    set({ loading: false });
  },
  updateUser: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.updateUser(data);
      const userId = data?.user_id;
      const newShopsByUser = get().shopsByUser;
      const index = newShopsByUser.users.findIndex((item) => item.user_id == userId);
      newShopsByUser.users[index] = data;
      console.log('newShopsByUser: ', newShopsByUser);
      set({ shopsByUser: newShopsByUser });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu user!');
    }
    set({ loading: false });
  },
  createUser: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.users.createUser(data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data.error || 'Có lỗi xảy ra khi lấy dữ liệu user!');
    }
    set({ loading: false });
  },

  getGroupUser: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.users.getGroupUser();
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data.error || 'Có lỗi xảy ra khi lấy dữ liệu user!');
    }
  },
}));
