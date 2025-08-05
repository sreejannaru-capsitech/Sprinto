import { useMutation, useQuery } from "@tanstack/react-query";
import {
  PROJECT_ACTIVITIES_KEY,
  PROJECT_OVERVIEW_KEY,
  PROJECT_TASKS_KEY,
  PROJECT_TEAM_KEY,
  PROJECTS_KEY,
  STALE_TIME,
} from "~/lib/const";
import {
  getProjectActivities,
  getProjectOverview,
  getProjects,
  getProjectTasks,
  getProjectTeam,
  removeMember,
} from "../project.api";
import { handleApiError } from "~/lib/utils";
import type { NotificationApi } from "~/hooks/useAntNotification";
import type { A } from "node_modules/react-router/dist/development/route-data-DjzmHYNR.mjs";

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: [PROJECTS_KEY],
    queryFn: getProjects,
    staleTime: STALE_TIME,
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

type MemberRemovePayload = {
  projectId: string;
  memberId: string;
};

export const useRemoveMember = (_api: NotificationApi) => {
  return useMutation<ApiResponse<null>, Error, MemberRemovePayload>({
    mutationFn: async ({ projectId, memberId }) => {
      return await removeMember(projectId, memberId);
    },
    onSuccess: () => {
      _api({ message: "Member removed successfully", type: "success" });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not remove member");
    },
  });
};
