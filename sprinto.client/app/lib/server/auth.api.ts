import axiosApi from ".";

export const login = async (email: string, password: string) => {
  const { data } = await axiosApi.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    {
      email,
      password,
    }
  );
  return data;
};

export const getMe = async () => {
  return (await axiosApi.get<ApiResponse<LoginResponse>>("/auth/me")).data;
};

export const logOut = async () => {
  return (await axiosApi.post<ApiResponse<null>>("/auth/me")).data;
};
