import { callApi, callApiFlashShip } from '../apis';

const getFlashShipPODVariant = () => {
  return callApi(`/flashship/all`, 'get');
};

const LoginFlashShip = (body: Record<string, unknown>) => {
  return callApiFlashShip('/seller-api/token', 'post', body);
};

const createOrderFlashShip = (body: Record<string, unknown>) => {
  return callApiFlashShip('/seller-api/orders/shirt-add', 'post', body);
};

const cancelOrderFlashShip = (body: Record<string, unknown>) => {
  return callApiFlashShip(`/seller-api/orders/seller-reject`, 'post', body);
};

const detailOrderFlashShip = (id: string) => {
  return callApiFlashShip(`/seller-api/orders/${id}`, 'get', {});
};

export const flashShip = {
  getFlashShipPODVariant,
  LoginFlashShip,
  createOrderFlashShip,
  cancelOrderFlashShip,
  detailOrderFlashShip,
};
