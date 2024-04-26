const tokenKey = 'tk-tk';

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function getTokenKey(setTokenKey: string) {
  return localStorage.getItem(setTokenKey);
}

export function setToken(setTokenKey: string, token: string) {
  return localStorage.setItem(setTokenKey, token);
}

export function setTempToken(token: string) {
  return sessionStorage.setItem(tokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(tokenKey);
}

export function setTokenExpand(tokenKey: string, token: string, expirationTime: string) {
  const currentTime = Date.now();
  const expireAt = currentTime + expirationTime;
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(`${tokenKey}-expiration`, expireAt);
}

export function removeExpiredTokens() {
  const keys = Object.keys(localStorage);
  const currentTime = Date.now();

  keys.forEach((key) => {
    if (key.endsWith('-expiration')) {
      const tokenKey = key.replace('-expiration', '');
      const expirationTime = localStorage.getItem(key);
      if (expirationTime && currentTime > parseInt(expirationTime)) {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(key);
      }
    }
  });
}

removeExpiredTokens();
