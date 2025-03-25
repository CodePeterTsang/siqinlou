import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { message } from "@/components/AntGlobal";

declare module "axios" {
  interface AxiosResponse<T = any> {
    total: number;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}
const instance = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.data.msg) {
      message.success(response.data.msg);
    }
    return response.data;
  },
  function (error) {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          // 客户端环境
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          window && (location.href = "/user/login");
        case 500:
          message.error(error.response.data.msg || "请求失败");
      }
    }
    return Promise.reject(error.response.data);
  }
);

export default instance;
