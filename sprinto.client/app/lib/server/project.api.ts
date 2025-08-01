import axiosApi from ".";

export const createProject = async (project: ProjectRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Project>>(
    "/projects",
    project
  );
  return data;
};

export const getProjects = async () => {
  const { data } = await axiosApi.get<ApiResponse<Project[]>>("/projects");
  return data;
};

export const getProjectActivities = async (projectId: string) => {
  const { data } = await axiosApi.get<ApiResponse<Activity[]>>(
    `/projects/${projectId}/tasks`
  );
  return data;
};

export const getProjectTasks = async (projectId: string) => {
  const { data } = await axiosApi.get<ApiResponse<Task[]>>(
    `/projects/${projectId}/tasks`
  );
  return data;
};
