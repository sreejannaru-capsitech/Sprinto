import axiosApi from ".";

export const getStatuses = async () => {
  const { data } = await axiosApi.get<ApiResponse<Status[]>>("/statuses");
  return data;
};

export const createStatus = async (status: StatusRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Status>>(
    "/statuses",
    status
  );
  return data;
};

export const updateStatus = async (id: string, status: StatusRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Status>>(
    `/statuses/${id}`,
    status
  );
  return data;
};

export const deleteStatus = async (id: string) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    `/statuses/${id}/delete`
  );
  return data;
};
