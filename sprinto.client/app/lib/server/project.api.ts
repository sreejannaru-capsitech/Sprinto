import axiosApi from ".";

export const createProject = async (project: ProjectRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Project>>(
    "/projects",
    project
  );
  return data;
};

export const updateProject = async (
  project: ProjectRequest,
  projectId: string
) => {
  const { data } = await axiosApi.post<ApiResponse<Project>>(
    `/projects/${projectId}`,
    project
  );
  return data;
};

export const getProjects = async (active: boolean = true) => {
  const { data } = await axiosApi.get<ApiResponse<Project[]>>(
    `/projects?active=${active}`
  );
  return data;
};

export const searchProjects = async (query: string) => {
  const { data } = await axiosApi.get<ApiResponse<Project[]>>(
    `/projects/search?query=${query}`
  );
  return data;
};

export const getAllProjects = async () => {
  const { data } = await axiosApi.get<ApiResponse<AllProjects>>(
    "/projects/all"
  );
  return data;
};

export const deleteProject = async (projectId: string) => {
  const { data } = await axiosApi.post<ApiResponse<null>>(
    `/projects/${projectId}/delete`
  );
  return data;
};

export const markProjectCompleted = async (projectId: string) => {
  const { data } = await axiosApi.post<ApiResponse<null>>(
    `/projects/${projectId}/complete`
  );
  return data;
};

export const checkAlias = async (alias: string) => {
  const { data } = await axiosApi.get<ApiResponse<boolean>>(
    `/projects/alias?key=${alias}`
  );
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

export const removeMember = async (projectId: string, memberId: string) => {
  const { data } = await axiosApi.post<ApiResponse<null>>(
    `/projects/${projectId}/team/remove`,
    memberId,
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export const addMembers = async (projectId: string, memberIds: string[]) => {
  const { data } = await axiosApi.post<ApiResponse<null>>(
    `/projects/${projectId}/team`,
    memberIds,
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export const getTopActiveProjects = async () => {
  const { data } = await axiosApi.get<ApiResponse<TopProjects[]>>(
    "/projects/top"
  );
  return data;
};

export const getLeastActiveProjects = async () => {
  const { data } = await axiosApi.get<ApiResponse<TopProjects[]>>(
    "/projects/least"
  );
  return data;
};

export const getProjectAssigneeCount = async () => {
  const { data } = await axiosApi.get<ApiResponse<ProjectAssigneeCount[]>>(
    "/projects/assignee-count"
  );
  return data;
};
