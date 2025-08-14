import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import {
  ALL_PROJECTS_KEY,
  LEAST_PROJECTS_KEY,
  PROJECT_ACTIVITIES_KEY,
  PROJECT_ASSIGNEE_COUNT_KEY,
  PROJECT_OVERVIEW_KEY,
  PROJECT_TASKS_KEY,
  PROJECT_TEAM_KEY,
  PROJECTS_KEY,
  PROJECTS_SEARCH_KEY,
  STALE_TIME,
  TOP_PROJECTS_KEY,
} from "~/lib/const";
import { handleApiError } from "~/lib/utils";
import {
  addMembers,
  createProject,
  deleteProject,
  getAllProjects,
  getLeastActiveProjects,
  getProjectActivities,
  getProjectAssigneeCount,
  getProjectOverview,
  getProjects,
  getProjectTasks,
  getProjectTeam,
  getTopActiveProjects,
  markProjectCompleted,
  removeMember,
  searchProjects,
  updateProject,
} from "../project.api";

const invalidateKeys = [
  PROJECTS_KEY,
  ALL_PROJECTS_KEY,
  TOP_PROJECTS_KEY,
  LEAST_PROJECTS_KEY,
];

export const useProjectsQuery = (active: boolean = true) => {
  return useQuery({
    queryKey: [PROJECTS_KEY, active],
    queryFn: async () => await getProjects(active),
    staleTime: STALE_TIME,
  });
};

export const useProjectsSearchQuery = (
  query: string,
  enasble: boolean = true
) => {
  return useQuery({
    queryKey: [PROJECTS_SEARCH_KEY, query],
    queryFn: () => searchProjects(query),
    enabled: enasble,
  });
};

export const useAllProjectsQuery = (active: boolean | null = null) => {
  const modifiedActive = active === null ? null : !active;
  return useQuery({
    queryKey: [ALL_PROJECTS_KEY, active],
    queryFn: async () => await getAllProjects(modifiedActive),
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
      invalidateKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not create project");
    },
  });
};

export const useDeleteProject = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      return await deleteProject(projectId);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "Project was deleted", type: "success" });
      invalidateKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not delete project");
    },
  });
};

export const useMarkProjectCompleted = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      return await markProjectCompleted(projectId);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "Project marked as completed", type: "success" });
      invalidateKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not mark project as completed");
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

export const useTopActiveProjectsQuery = () => {
  return useQuery({
    queryKey: [TOP_PROJECTS_KEY],
    queryFn: getTopActiveProjects,
    staleTime: STALE_TIME,
  });
};

export const useLeastActiveProjectsQuery = () => {
  return useQuery({
    queryKey: [LEAST_PROJECTS_KEY],
    queryFn: getLeastActiveProjects,
    staleTime: STALE_TIME,
  });
};

export const useProjectAssigneeCountQuery = () => {
  return useQuery({
    queryKey: [PROJECT_ASSIGNEE_COUNT_KEY],
    queryFn: getProjectAssigneeCount,
    staleTime: STALE_TIME,
  });
};
