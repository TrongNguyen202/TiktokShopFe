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

export function setTokenExpand(tokenKey, token, expirationTime) {
  const currentTime = new Date().getTime();
  const expireAt = currentTime + expirationTime;

  localStorage.setItem(tokenKey, token);
  localStorage.setItem(tokenKey + '-expiration', expireAt);
}

export function removeExpiredTokens() {
  const keys = Object.keys(localStorage);
  const currentTime = new Date().getTime();

  keys.forEach(key => {
    if (key.endsWith('-expiration')) {
      const tokenKey = key.replace('-expiration', '');
      const expirationTime = localStorage.getItem(key);
      if (expirationTime && currentTime > parseInt(expirationTime)) {
        console.log('true');
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(key);
      }
    }
  });
}

removeExpiredTokens();
