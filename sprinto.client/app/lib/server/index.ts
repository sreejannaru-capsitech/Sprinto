import axios from "axios";
import { BASE_URL } from "../const";
import { useQueryClient } from "@tanstack/react-query";

const axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use((config) => {
  // Include the token in the Authorization header if it exists
  const queryClient = useQueryClient();
  const store = queryClient.getQueryData<ApiResponse<LoginResponse>>(["me"]);
  if (store && store.result) {
    config.headers.Authorization = `Bearer ${store.result.accessToken}`;
  }
  return config;
});

export default axiosApi;
