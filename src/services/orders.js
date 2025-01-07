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

const updatePackageStatus = (id, body)=>{
  return callApi(`/package/${id}/update-status/`, 'put', body)
}

const updateFulfillmentName = (id, body)=>{
  return callApi(`/package/${id}/update-fulfillment-name/`, 'put', body)
}
const getFlashShipPodVariants =() => {
  
  return callApi(`/flashship/all`)
};
const getCkfPodVariants = ()=>{
  return callApi(`/ckf/all`)
}
const getUserShop =()=>{
  return callApi('/shops', 'get')
}
const getCurrentUserInfor =() =>{
  return callApi('/groups/user_login_infor', 'get')
}
const getPackageNumberSortMax = () =>{
  return callApi('/package-max/','get')
}
export const orders = {
  getUserGroup,
  getAllPackages,
  updateProductPackage,
  updatePackageStatus,
  updateFulfillmentName,
  getFlashShipPodVariants,
  getCkfPodVariants,
  getUserShop,
  getCurrentUserInfor,
  getPackageNumberSortMax
}
