import { callApi } from '../apis'

const getAllStores = () => {
  return callApi('/shops', 'get')
}

const createStore = (params) => {
  return callApi('/shops', 'post', params)
}

const getStoreById = (id) => {
  return callApi(`/manage/shops/${id}`, 'get')
}

const searchStores = (query) => {
  return callApi(`/manage/shops?${query}`, 'get')
}

export const stores = {
  getAllStores,
  getStoreById,
  searchStores,
  createStore
}
