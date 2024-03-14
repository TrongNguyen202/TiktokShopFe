import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useFlashShipStores = create((set) => ({
  loading: false,
  getFlashShipPODVariant: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.flashShip.getFlashShipPODVariant();
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  LoginFlashShip: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.LoginFlashShip(body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  createOrderFlashShip: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.createOrderFlashShip(body);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
}));
