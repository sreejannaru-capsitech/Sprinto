import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import {
  PROJECT_ACTIVITIES_KEY,
  PROJECT_OVERVIEW_KEY,
  PROJECT_TASKS_KEY,
  PROJECT_TEAM_KEY,
  PROJECTS_KEY,
  STALE_TIME,
} from "~/lib/const";
import { handleApiError } from "~/lib/utils";
import {
  addMembers,
  createProject,
  getProjectActivities,
  getProjectOverview,
  getProjects,
  getProjectTasks,
  getProjectTeam,
  removeMember,
  updateProject,
} from "../project.api";

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: [PROJECTS_KEY],
    queryFn: getProjects,
    staleTime: STALE_TIME,
  });
};

export const useCreateProject = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (project: ProjectRequest) => {
      return await createProject(project);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "New project was created", type: "success" });
      query.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not create project");
    },
  });
};

export const useProjectActivitiesQuery = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECT_ACTIVITIES_KEY, projectId],
    queryFn: () => getProjectActivities(projectId),
    staleTime: STALE_TIME,
  });
};

export const useProjectTasksQuery = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECT_TASKS_KEY, projectId],
    queryFn: () => getProjectTasks(projectId),
    staleTime: STALE_TIME,
  });
};

export const useProjectOverviewQuery = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECT_OVERVIEW_KEY, projectId],
    queryFn: () => getProjectOverview(projectId),

    staleTime: STALE_TIME,
  });
};

export const useProjectTeamQuery = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECT_TEAM_KEY, projectId],
    queryFn: () => getProjectTeam(projectId),
    staleTime: STALE_TIME,
  });
};

type UpdateProjectPayload = {
  projectId: string;
  project: ProjectRequest;
};

export const useUpdateProject = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation<ApiResponse<Project>, Error, UpdateProjectPayload>({
    mutationFn: async ({ projectId, project }) => {
      return await updateProject(project, projectId);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "Project was updated", type: "success" });
      query.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update project");
    },
  });
};

type MemberRemovePayload = {
  projectId: string;
  memberId: string;
};

export const useRemoveMember = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation<ApiResponse<null>, Error, MemberRemovePayload>({
    mutationFn: async ({ projectId, memberId }) => {
      return await removeMember(projectId, memberId);
    },
    onSuccess: () => {
      _api({ message: "Member removed from project", type: "success" });
      query.invalidateQueries({ queryKey: [PROJECT_TEAM_KEY] });
      query.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not remove member");
    },
  });
};

type MemberAddPayload = {
  projectId: string;
  memberIds: string[];
};

export const useAddMembers = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation<ApiResponse<null>, Error, MemberAddPayload>({
    mutationFn: async ({ projectId, memberIds }) => {
      return await addMembers(projectId, memberIds);
    },
    onSuccess: () => {
      _api({ message: "Members added to the project", type: "success" });
      query.invalidateQueries({ queryKey: [PROJECT_TEAM_KEY] });
      query.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not add members");
    },
  });
};
