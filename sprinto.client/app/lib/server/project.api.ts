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
  const { data } = await axiosApi.get<ApiResponse<TaskActivity[]>>(
    `/projects/${projectId}/activities`
  );
  return data;
};

export const getProjectTasks = async (projectId: string) => {
  const { data } = await axiosApi.get<ApiResponse<Task[]>>(
    `/projects/${projectId}/tasks`
  );
  return data;
};

export const getProjectOverview = async (projectId: string) => {
  const { data } = await axiosApi.get<ApiResponse<ProjectOverview>>(
    `/projects/${projectId}/overview`
  );
  return data;
};

export const getProjectTeam = async (projectId: string) => {
  const { data } = await axiosApi.get<ApiResponse<ProjectTeam>>(
    `/projects/${projectId}/team`
  );
  return data;
};
