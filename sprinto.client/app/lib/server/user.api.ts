import axiosApi from ".";

export const createUser = async (user: UserRequest) => {
  const { data } = await axiosApi.post<ApiResponse<User>>("/users", user);
  return data;
};