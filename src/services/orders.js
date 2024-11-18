import { callApi } from '../apis'

const getUserGroup = () => {
  return callApi('/user-shops/groups', 'get')
}

const getAllPackages = (params) => {
  return callApi(`/packages/filter${params}`, 'get')
}
const updateProductPackage = (id, body)=>{
  return callApi(`/product-package/${id}/update/`, 'put', body)
}

export const orders = {
  getUserGroup,
  getAllPackages,
  updateProductPackage
}
