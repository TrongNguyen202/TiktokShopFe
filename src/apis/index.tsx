import axios from 'axios';
import { constants as c } from '../constants';
import { getToken, getTokenKey, removeToken } from '../utils/auth';

const exceptPrefix = ['/login', '/register'];
const checkEndPoint = (endpoint: string) => {
  for (const prefix of exceptPrefix) {
    if (endpoint.includes(prefix)) {
      return true;
    }
  }
  return false;
};

// eslint-disable-next-line consistent-return
export const callApi = (endPoint: string, method: string, body?: any) => {
  if (checkEndPoint(endPoint) === false) {
    axios.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    axios.interceptors.response.use(
      (response) => {
        if (response?.data?.code === 12052700) {
          Promise.reject(response);
        }
        return response;
      },
      (error) => {
        if (error?.response?.data?.code === 404) {
          // window.location.replace("/khong-tim-thay-trang");
        } else if (error?.response?.data?.code === 401) {
          removeToken();
          // history.push("/login")
        }
        return Promise.reject(error);
      },
    );
  }

  try {
    return axios({
      method,
      url: `${c.API_URL}${endPoint}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
};

// eslint-disable-next-line consistent-return
export const callApiFlashShip = async (endPoint: string, method: string, body: any) => {
  if (checkEndPoint(endPoint) === false) {
    const tokenFlashShip = getTokenKey('flash-ship-tk');
    const headers = {
      'Content-Type': 'application/json',
      ...(tokenFlashShip && { Authorization: `Bearer ${tokenFlashShip}` }),
    };

    try {
      const response = await fetch(`${c.API_FLASH_SHIP}${endPoint}`, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.code === 12052700) {
          return Promise.reject(responseData);
        }
        if (responseData.code === 401) {
          removeToken();
        }
        return Promise.reject(responseData);
      }

      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
