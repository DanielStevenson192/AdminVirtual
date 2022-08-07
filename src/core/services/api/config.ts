import { AxiosRequestConfig } from "axios";
import { env } from '../../../env'
/* const baseUrl = 'https://devserver.advantage.com.co/quickturn/'; */
/* const baseUrl = 'http://192.168.1.111:8080/quickturn/'; */
// const baseUrl = 'https://devserver.advantage.com.co/quickturn/';
const baseUrl = env.REACT_APP_ENDPOINT;

export const axiosRequestConfiguration: AxiosRequestConfig = {
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/x-www-form-urlencoded",
  },
};
