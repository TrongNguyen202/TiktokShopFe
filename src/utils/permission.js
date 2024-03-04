import { permission } from "../constants";

export const hasManagerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || Array.isArray(user.role)) return false;
  if (user.role[0] === permission.MANAGER) return true;
  return false
}

export const hasSellerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.SELLER) return true;
  return false
}