import { callApi } from '../apis'

const getAllBrand = (id) => {
  return callApi(`/shops/${id}/brands`, 'get')
}

export const brand = {
  getAllBrand
}
