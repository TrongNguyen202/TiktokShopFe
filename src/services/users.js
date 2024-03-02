import { callApi } from '../apis'

const getShopByUser = () => {
  return callApi(`/user-shops/groups`, 'get')
}

const getUserInfor = (userId) => {
  return callApi(`/user/${userId}/groups/infor`, 'get')
}

const updateUser = (data) => {
  return callApi(`/groups/change_user`, 'post', data)
}

const createUser = (data) => {
  return callApi(`/groups/add_user_group`, 'post', data)
}

export const users = {
  getShopByUser,
  getUserInfor,
  updateUser,
  createUser
}
