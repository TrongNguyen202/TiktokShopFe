import axios from 'axios';
import { constants as c } from '../constants';
import { callApi, callApiFlashShip } from '../apis';

const getFlashShipPODVariant = () => {
  return callApi(`/flashship/all`, 'get');
};

const LoginFlashShip = (body) => {
  return axios({
    method: 'post',
    url: `${c.API_FLASH_SHIP}/token`,
    data: body,
  });
};

const createOrderFlashShip = (body) => {
  return callApiFlashShip('/orders/shirt-add', 'post', body);
};

const cancelOrderFlashShip = (body) => {
  return callApiFlashShip(`/orders/seller-reject`, 'post', body);
};

const detailOrderFlashShip = (id) => {
  return callApiFlashShip(`/orders/${id}`, 'get');
};

export const flashShip = {
  getFlashShipPODVariant,
  LoginFlashShip,
  createOrderFlashShip,
  cancelOrderFlashShip,
  detailOrderFlashShip,
};
