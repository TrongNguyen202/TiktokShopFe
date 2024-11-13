import { callApi } from '../apis'

const getUserGroup = () => {
  return callApi('/user-shops/groups', 'get')
}

const getAllPackages = (params) => {
  return callApi(`/packages/filter${params}`, 'get')
}

export const orders = {
  getUserGroup,
  getAllPackages
}
