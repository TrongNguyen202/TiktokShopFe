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

export const users = {
  getShopByUser,
  getUserInfor,
  updateUser
}
