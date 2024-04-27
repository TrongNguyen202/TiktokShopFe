import { permission } from '../constants/role';

// eslint-disable-next-line consistent-return
export const validatePermission = (roles: number[]) => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  if (!user || !Array.isArray(user.role)) return false;

  if (roles.indexOf(user.role[0])) {
    return true;
  }
  return true;
};

export const hasManagerPermission = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.MANAGER) return true;
  return false;
};

export const hasSellerPermission = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.SELLER) return true;
  return false;
};

export const hasDesignerPermission = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.DESIGNER) return true;
  return false;
};
