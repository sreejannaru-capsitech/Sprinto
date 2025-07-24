import axios from "axios";
import { BASE_URL } from "../const";
import { queryClient } from "./queryClient";

const axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use((config) => {
  // Include the token in the Authorization header if it exists
  const store = queryClient.getQueryData<ApiResponse<LoginResponse>>(["me"]);
  if (store && store.result) {
    config.headers.Authorization = `Bearer ${store.result.accessToken}`;
  }
  return config;
});

export default axiosApi;

// Export everything from the server API
export { queryClient } from "./queryClient";
export { login } from "./auth.api";