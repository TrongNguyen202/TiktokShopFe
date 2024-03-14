import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { removeToken } from '../utils/auth';

export const useAuthStore = create((set) => ({
  tokenInfo: {},
  loading: false,
  login: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.login(form);
      set({ tokenInfo: response.data.access });
      onSuccess(response.data.access);
    } catch (error) {
      onFail(error.response.data.msg || 'Tài khoản hoặc mật khẩu không đúng!');
    }
    set({ loading: false });
  },
  register: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.register(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  checkExists: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.checkExists(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  resetPassword: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.resetPassword(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  sendOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.sendOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  sendEmailOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.sendEmailOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  getProfileInfo: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.getProfileInfo();
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  logOut: async (onSuccess, onFail = () => {}) => {
    try {
      removeToken();
      // localStorage.removeItem("profile")
      // localStorage.removeItem("badges")
      localStorage.removeItem('user');
      set({ tokenInfo: {} });
      onSuccess();
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
}));
