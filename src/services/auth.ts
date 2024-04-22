import { callApi } from '../apis';

const login = (form: any) => {
  return callApi('/login', 'post', form);
};
const register = (form: any) => {
  return callApi('/register', 'post', form);
};
const checkExists = (form: any) => {
  return callApi('/login/check_exists', 'post', form);
};
const resetPassword = (form: any) => {
  return callApi('/reset_password', 'post', form);
};
const sendOtp = (form: any) => {
  return callApi('/send_otp', 'post', form);
};
const sendEmailOtp = (form: any) => {
  return callApi('/send_email_otp', 'post', form);
};

const getProfileInfo = () => {
  return callApi('/groups/user_login_infor', 'get');
};

export const auth = {
  login,
  register,
  sendOtp,
  checkExists,
  resetPassword,
  sendEmailOtp,
  getProfileInfo,
};
