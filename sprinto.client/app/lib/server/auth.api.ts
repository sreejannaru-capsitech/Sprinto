import axiosApi, { _axiosApi } from ".";

export const login = async (email: string, password: string) => {
  const { data } = await _axiosApi.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    {
      email,
      password,
    }
  );
  return data;
};

export const getMe = async () => {
  return (await _axiosApi.get<ApiResponse<LoginResponse>>("/auth/me")).data;
};

export const updateMe = async (user: UserUpdateRequest) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    "/users/update",
    user
  );
  return data;
};

export const logOut = async () => {
  return (await _axiosApi.post<ApiResponse<null>>("/auth/me")).data;
};

export const changePassword = async (request: PasswordChangeRequest) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    "/auth/change-password",
    request
  );
  return data;
};