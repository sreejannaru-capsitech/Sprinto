import axiosApi from ".";

export const getStatuses = async () => {
  const { data } = await axiosApi.get<ApiResponse<Status[]>>("/statuses");
  return data;
};

export const createTask = async (task: TaskItemRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Task>>("/tasks", task);
  return data;
};

export const updateTask = async (id: string, task: TaskItemRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Task>>(`/tasks/${id}`, task);
  return data;
};

export const getTodayTasks = async () => {
  const { data } = await axiosApi.get<ApiResponse<TodayTasks>>("/tasks/today");
  return data;
};

export const getInboxTasks = async () => {
  const { data } = await axiosApi.get<ApiResponse<Task[]>>("/tasks/inbox");
  return data;
};

export const getUpcomingTasks = async () => {
  const { data } = await axiosApi.get<ApiResponse<ProjectTaskGroup[]>>("/tasks/upcoming");
  return data;
};
