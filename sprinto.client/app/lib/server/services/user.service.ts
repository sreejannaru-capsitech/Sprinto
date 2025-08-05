import { useQuery } from "@tanstack/react-query";
import { getMe } from "../auth.api";
import {
  EMPLOYEES_KEY,
  PROFILE_KEY,
  STALE_TIME,
  TEAM_LEADS_KEY,
  USERS_SEARCH_KEY,
} from "~/lib/const";
import { getEmployees, getTeamLeads, searchUsers } from "../user.api";

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

export const useUserSearchQuery = (query: string) => {
  return useQuery({
    queryKey: [USERS_SEARCH_KEY, query],
    queryFn: () => searchUsers(query),
  });
};
