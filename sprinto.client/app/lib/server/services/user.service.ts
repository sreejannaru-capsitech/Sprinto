import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "../auth.api";
import {
  EMPLOYEES_KEY,
  PROFILE_KEY,
  STALE_TIME,
  TEAM_LEADS_KEY,
  USERS_SEARCH_KEY,
} from "~/lib/const";
import { getEmployees, getTeamLeads, searchUsers } from "../user.api";
import { handleApiError } from "~/lib/utils";
import type { NotificationApi } from "~/hooks/useAntNotification";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });
};

export const useProfileUpdate = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (user: UserUpdateRequest) => {
      return await updateMe(user);
    },
    onSuccess: () => {
      _api({ message: "Profile updated successfully", type: "success" });
      query.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update profile");
    },
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
