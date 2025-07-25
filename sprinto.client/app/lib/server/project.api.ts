import axiosApi from ".";

export const createProject = async (project: ProjectRequest) => {
  const { data } = await axiosApi.post<ApiResponse<Project>>("/projects", project);
  return data;
};