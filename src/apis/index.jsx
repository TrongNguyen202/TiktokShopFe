import axios from 'axios'
import { constants as c } from '../constants'
import { getToken, removeToken } from '../utils/auth'
// import { DeviceUUID } from "device-uuid";
// const uuid = new DeviceUUID().get();
const exceptPrefix = ['/login', '/register']
const checkEndPoint = (endpoint) => {
  for (const prefix of exceptPrefix) {
    if (endpoint.includes(prefix)) {
      return true
    }
  }
  return false
}

export const callApi = (endPoint, method, body) => {
  if (checkEndPoint(endPoint) === false) {
    axios.interceptors.request.use(
      (config) => {
        const token = getToken()
        console.log('token: ', token);
        if (token) {
          config.headers['Authorization'] =  `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error?.response?.data?.code === 404) {
          // window.location.replace("/khong-tim-thay-trang");
        } else if (error?.response?.data?.code === 401) {
          removeToken()
          // history.push("/login")
        }
        return Promise.reject(error)
      },
    )
  }

  try {
    return axios({
      method,
      url: `${c.API_URL}${endPoint}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        // "device-id": `${c.STORE_CODE}-${uuid}`,
        // "device-id": `ikidemo-2750bc42-702e-4cbe-bae5-798f171389e1`,
      },
    })

  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}
