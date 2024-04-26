import { permission } from '../constants';

// eslint-disable-next-line consistent-return
export const validatePermission = (roles: number[]) => {
  const user = JSON.parse(localStorage.getItem('user') || '');
  if (!user || !Array.isArray(user.role)) return false;

  if (roles.indexOf(user.role[0])) {
    return true;
  }
};

export const hasManagerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user') || '');
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.MANAGER) return true;
  return false;
};

export const hasSellerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user') || '');
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.SELLER) return true;
  return false;
};

export const hasDesignerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user') || '');
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.DESIGNER) return true;
  return false;
};
