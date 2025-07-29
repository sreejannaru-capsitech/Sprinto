import { useQuery } from "@tanstack/react-query";
import { ASSIGNED_PROJECTS_KEY, STALE_TIME, PROJECTS_KEY } from "~/lib/const";
import { getAssignedProjects, getProjects } from "../project.api";

export const useAssignedProjectsQuery = () => {
  return useQuery({
    queryKey: [ASSIGNED_PROJECTS_KEY],
    queryFn: getAssignedProjects,
    staleTime: STALE_TIME,
  });
};

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: [PROJECTS_KEY],
    queryFn: getProjects,
    staleTime: STALE_TIME,
  });
};
