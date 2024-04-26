import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { handleAxiosError } from '../utils/handleAxiosError';

interface FlashShipStores {
  loading: boolean;
  getFlashShipPODVariant: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  LoginFlashShip: (body: Record<string, unknown>, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  createOrderFlashShip: (
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
  detailOrderFlashShip: (orderId: string, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  cancelOrderFlashShip: (
    body: Record<string, unknown>,
    onSuccess: (data: any) => void,
    onFail: (data: any) => void,
  ) => void;
}

export const useFlashShipStores = create<FlashShipStores>((set) => ({
  loading: false,
  getFlashShipPODVariant: async (onSuccess, onFail) => {
    try {
      const response = await RepositoryRemote.flashShip.getFlashShipPODVariant();
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
  },

  LoginFlashShip: async (body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.LoginFlashShip(body);
      onSuccess(response?.data);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  createOrderFlashShip: async (body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.createOrderFlashShip(body);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  detailOrderFlashShip: async (orderId, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.detailOrderFlashShip(orderId);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },

  cancelOrderFlashShip: async (body, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.cancelOrderFlashShip(body);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
