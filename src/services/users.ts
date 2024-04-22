import { callApi } from '../apis';

const getShopByUser = () => {
  return callApi(`/user-shops/groups`, 'get');
};

const getUserInfo = (userId) => {
  return callApi(`/user/${userId}/groups/infor`, 'get');
};

const updateUser = (data) => {
  return callApi(`/groups/change_user`, 'put', data);
};

const createUser = (data) => {
  return callApi(`/groups/add_user_group`, 'post', data);
};

const getGroupUser = () => {
  return callApi(`/groupcustoms/`, 'get');
};

export const users = {
  getShopByUser,
  getUserInfo,
  updateUser,
  createUser,
  getGroupUser,
};
