import axiosApi from ".";

export const getStatuses = async () => {
  const { data } = await axiosApi.get<ApiResponse<Status[]>>("/statuses");
  return data;
};

export const getAllTasks = async (
  pageNumber: number,
  pageSize: number,
  priority?: TaskPriority,
  status?: string
) => {
  const { data } = await axiosApi.get<ApiResponse<PagedResult<Task>>>(
    "/tasks" +
      `?pageNumber=${pageNumber}&pageSize=${pageSize}&priority=${priority}&status=${status}`
  );
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
  const { data } = await axiosApi.get<ApiResponse<InboxTasks>>("/tasks/inbox");
  return data;
};

export const getUpcomingTasks = async () => {
  const { data } = await axiosApi.get<ApiResponse<ProjectTaskGroup[]>>(
    "/tasks/upcoming"
  );
  return data;
};

export const getTaskActivities = async (taskId: string) => {
  const { data } = await axiosApi.get<ApiResponse<Activity[]>>(
    `/tasks/${taskId}/activities`
  );
  return data;
};

export const deleteTask = async (taskId: string) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    `/tasks/${taskId}/delete`
  );
  return data;
};

export const searchTasks = async (query: string) => {
  const { data } = await axiosApi.get<ApiResponse<Task[]>>(
    `/tasks/search?query=${query}`
  );
  return data;
};

export const getTopDueTasks = async () => {
  const { data } = await axiosApi.get<ApiResponse<Task[]>>(`/tasks/topdue`);
  return data;
};

export const getTaskStatistics = async () => {
  const { data } = await axiosApi.get<ApiResponse<TaskStatistics>>(
    `/tasks/stats`
  );
  return data;
};
