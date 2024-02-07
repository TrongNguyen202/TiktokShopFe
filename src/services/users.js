import { callApi } from '../apis'

const getShopByUser = () => {
  return callApi(`/user-shops/groups`, 'get')
}

export const users = {
  getShopByUser
}
