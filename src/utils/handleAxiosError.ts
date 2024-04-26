import { AxiosError } from 'axios';

export const handleAxiosError = (error: any) => {
  if (error instanceof AxiosError) {
    return error?.response?.data?.msg || 'Có lỗi xảy ra!';
  }
  return error?.message || 'Có lỗi xảy ra!';
};
