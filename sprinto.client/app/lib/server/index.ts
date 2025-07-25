import axios from "axios";
import { BASE_URL, PROFILE_KEY } from "../const";
import { queryClient } from "./queryClient";

const axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use((config) => {
  // Include the token in the Authorization header if it exists
  const store = queryClient.getQueryData<ApiResponse<LoginResponse>>([
    PROFILE_KEY,
  ]);
  if (store && store.result) {
    config.headers.Authorization = `Bearer ${store.result.accessToken}`;
  }
  return config;
});

export default axiosApi;

// Export everything from the server API
export { queryClient } from "./queryClient";
export * from "./auth.api";
export * from "./user.api";