import Cookies from 'js-cookie';

const tokenKey = 'tk-tk';
const refreshTokenKey = 'refreshToken';

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function getTokenKey(setTokenKey) {
  return localStorage.getItem(setTokenKey);
}

export function setToken(setTokenKey, token) {
  return localStorage.setItem(setTokenKey, token);
}

export function setTempToken(token) {
  return sessionStorage.setItem(tokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(tokenKey);
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey);
}

export function setRefreshToken(refreshToken, maxAge) {
  return Cookies.set(refreshTokenKey, refreshToken, {
    expires: maxAge / 86400,
  });
}

export const removeRefreshToken = () => Cookies.remove(refreshTokenKey);
