import axios from 'axios'
import { constants as c } from '../constants'
import { callApi } from '../apis'

const getFlashShipPODVariant = () => {
    return callApi(`/flashship/all`, 'get')
}

const LoginFlashShip = (body) => {
    return axios({
        method: "post",
        url: `${c.API_FLASH_SHIP}/token`,
        data: body

    })
}

const createOrderFlashShip = (body) => {
    return axios({
        method: "post",
        url: `${c.API_FLASH_SHIP}/orders/shirt-add`,
        data: body

    })
}

const cancelOrderFlashShip = (body) => {
    return axios({
        method: "post",
        url: `${c.API_FLASH_SHIP}/orders/seller-reject`,
        data: body

    })
}

const detailOrderFlashShip = (id) => {
    return axios({
        method: "get",
        url: `${c.API_FLASH_SHIP}/orders/${id}`,

    })
}

export const flashShip = {
    getFlashShipPODVariant,
    LoginFlashShip,
    createOrderFlashShip,
    cancelOrderFlashShip,
    detailOrderFlashShip
}