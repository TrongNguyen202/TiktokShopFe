import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { removeToken } from '../utils/auth';
import { handleAxiosError } from '../utils/handleAxiosError';

interface AuthStore {
  tokenInfo: Record<string, unknown>;
  profile: any;
  loading: boolean;
  login: (form: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  register: (form: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  checkExists: (form: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  resetPassword: (form: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  sendOtp: (form: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  sendEmailOtp: (form: any, onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  getProfileInfo: (onSuccess: (data: any) => void, onFail: (data: any) => void) => void;
  logOut: (onSuccess?: () => void, onFail?: (data: any) => void) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  tokenInfo: {},
  profile: {},
  loading: false,
  login: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.login(form);
      set({ tokenInfo: response?.data.access });
      onSuccess(response?.data.access);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  register: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.register(form);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  checkExists: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.checkExists(form);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  resetPassword: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.resetPassword(form);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  sendOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.sendOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  sendEmailOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.sendEmailOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  getProfileInfo: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.getProfileInfo();
      set({ profile: response?.data });
      onSuccess(response);
    } catch (error) {
      onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
  logOut: async (onSuccess, onFail) => {
    try {
      removeToken();
      localStorage.removeItem('user');
      localStorage.removeItem('flash-ship-tk');
      localStorage.removeItem('flash-ship-tk-expiration');
      set({ tokenInfo: {} });
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onFail) onFail(handleAxiosError(error));
    }
    set({ loading: false });
  },
}));
