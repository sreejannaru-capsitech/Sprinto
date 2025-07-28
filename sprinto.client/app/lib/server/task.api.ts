import axiosApi from ".";

export const getStatuses = async () => {
  const { data } = await axiosApi.get<ApiResponse<Status[]>>("/statuses");
  return data;
};