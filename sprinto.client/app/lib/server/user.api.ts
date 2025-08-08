import axiosApi from ".";
import { USER_ADMIN, USER_EMPLOYEE, USER_TEAM_LEAD } from "../const";

export const createUser = async (user: UserRequest) => {
  const { data } = await axiosApi.post<ApiResponse<User>>("/users", user);
  return data;
};

export const getEmployees = async () => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<User>>>(
    `/users?role=${USER_EMPLOYEE}`
  );
  return data;
};

export const getTeamLeads = async () => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<User>>>(
    `/users?role=${USER_TEAM_LEAD}`
  );
  return data;
};

export const getAdmins = async () => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<User>>>(
    `/users?role=${USER_ADMIN}`
  );
  return data;
};

export const searchUsers = async (query: string, role?: UserRole) => {
  const { data } = await axiosApi.get<ApiResponse<User[]>>(
    `/users/search?name=${query}&role=${role}`
  );
  return data;
};

export const getUserProfilePic = async (userId: string) => {
  const { data } = await axiosApi.get<ApiResponse<string | null>>(
    `/users/${userId}/picture`
  );
  return data;
};
