import axios, { AxiosError, type AxiosResponse } from "axios";
import { BASE_URL, PROFILE_KEY } from "../const";
import { queryClient } from "./queryClient";

// Instance which does not include the token in the Authorization header
export const _axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Instance which includes the token in the Authorization header
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

// Throw custom error on status === false
axiosApi.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.data?.status === false) {
      // Check if the error is a 400 Bad Request
      if (response.data?.message === "Bad request payload")
        throw new AxiosError(
          response.data?.errors[0] ?? "Please provide valid data"
        );
      // Throw a custom error
      else throw new AxiosError(response.data.message || "Request failed");
    }
    return response;
  },
  (error) => {
    // Optional: handle network or server errors separately
    return Promise.reject(error);
  }
);

export default axiosApi;

// Export everything from the server API
export { queryClient } from "./queryClient";
export * from "./auth.api";
export * from "./user.api";
export * from "./project.api";
export * from "./task.api";
export * from "./comment.api";
