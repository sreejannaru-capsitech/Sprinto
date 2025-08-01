import { useQuery } from "@tanstack/react-query";
import { PROJECTS_KEY, STALE_TIME } from "~/lib/const";
import { getProjects } from "../project.api";

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: [PROJECTS_KEY],
    queryFn: getProjects,
    staleTime: STALE_TIME,
  });
};
