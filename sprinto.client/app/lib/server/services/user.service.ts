import { useQuery } from "@tanstack/react-query";
import { getMe } from "../auth.api";
import { EMPLOYEES_KEY, PROFILE_KEY, TEAM_LEADS_KEY } from "~/lib/const";
import { getEmployees, getTeamLeads } from "../user.api";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });
};

export const useEmployeesQuery = () => {
  return useQuery({
    queryKey: [EMPLOYEES_KEY],
    queryFn: getEmployees,
    staleTime: STALE_TIME,
  });
};

export const useTeamLeadsQuery = () => {
  return useQuery({
    queryKey: [TEAM_LEADS_KEY],
    queryFn: getTeamLeads,
    staleTime: STALE_TIME,
  });
};
