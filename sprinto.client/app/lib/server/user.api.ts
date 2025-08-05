import axiosApi from ".";
import { USER_ROLES } from "../const";

export const createUser = async (user: UserRequest) => {
  const { data } = await axiosApi.post<ApiResponse<User>>("/users", user);
  return data;
};

export const getEmployees = async () => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<User>>>(
    `/users?role=${USER_ROLES[2]}`
  );
  return data;
};

export const getTeamLeads = async () => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<User>>>(
    `/users?role=${USER_ROLES[1]}`
  );
  return data;
};

export const getAdmins = async () => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<User>>>(
    `/users?role=${USER_ROLES[0]}`
  );
  return data;
};

export const searchUsers = async (query: string) => {
  const { data } = await axiosApi.get<ApiResponse<User[]>>(
    `/users/search?name=${query}`
  );
  return data;
};
