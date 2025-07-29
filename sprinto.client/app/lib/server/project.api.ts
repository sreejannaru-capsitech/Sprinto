import axiosApi from ".";

export const createProject = async (project: ProjectRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Project>>("/projects", project);
  return data;
};

export const getProjects = async () => {
  const { data } = await axiosApi.get<ApiResponse<Project[]>>("/projects");
  return data;
};

export const getAssignedProjects = async () => {
  const { data } = await axiosApi.get<ApiResponse<Project[]>>("/projects/assigned");
  return data;
};
