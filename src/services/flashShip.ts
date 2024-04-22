import { callApi, callApiFlashShip } from '../apis';

const getFlashShipPODVariant = () => {
  return callApi(`/flashship/all`, 'get');
};

const LoginFlashShip = (body) => {
  return callApiFlashShip('/seller-api/token', 'post', body);
};

const createOrderFlashShip = (body) => {
  return callApiFlashShip('/seller-api/orders/shirt-add', 'post', body);
};

const cancelOrderFlashShip = (body) => {
  return callApiFlashShip(`/seller-api/orders/seller-reject`, 'post', body);
};

const detailOrderFlashShip = (id) => {
  return callApiFlashShip(`/seller-api/orders/${id}`, 'get');
};

export const flashShip = {
  getFlashShipPODVariant,
  LoginFlashShip,
  createOrderFlashShip,
  cancelOrderFlashShip,
  detailOrderFlashShip,
};
