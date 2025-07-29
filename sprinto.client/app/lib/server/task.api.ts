import axiosApi from ".";

export const getStatuses = async () => {
  const { data } = await axiosApi.get<ApiResponse<Status[]>>("/statuses");
  return data;
};

export const createTask = async (task: TaskItemRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Task>>("/tasks", task);
  return data;
};