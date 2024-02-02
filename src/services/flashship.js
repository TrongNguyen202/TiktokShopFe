import axios from 'axios'
import { constants as c } from '../constants'

const createOrderFlashShip = (body) => {
    return axios({
        method: "post",
        url: `${c.API_FLASH_SHIP}/shirt-add`,
        data: body

    })
}

const cancelOrderFlashShip = (body) => {
    return axios({
        method: "post",
        url: `${c.API_FLASH_SHIP}/seller-reject`,
        data: body

    })
}

const detailOrderFlashShip = (id) => {
    return axios({
        method: "get",
        url: `${c.API_FLASH_SHIP}/${id}`,

    })
}

export const flashship = {
    createOrderFlashShip,
    cancelOrderFlashShip,
    detailOrderFlashShip
}