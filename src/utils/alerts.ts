import { toast } from 'react-toastify';

const success = (message: string) => {
  toast.success(message, {
    delay: 0,
    pauseOnHover: false,
  });
};
const error = (message: string) => {
  toast.error(message, {
    delay: 0,
    pauseOnHover: false,
  });
};
const warning = (message: string) => {
  toast.warning(message, {
    delay: 0,
    pauseOnHover: false,
  });
};
export const alerts = {
  success,
  error,
  warning,
};
