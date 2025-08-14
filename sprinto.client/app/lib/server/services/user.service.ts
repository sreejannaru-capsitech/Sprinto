import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, getMe, updateMe } from "../auth.api";
import {
  EMPLOYEES_KEY,
  PAGED_USERS_KEY,
  PROFILE_KEY,
  PROFILE_PICTURE_KEY,
  PROJECT_TEAM_KEY,
  STALE_TIME,
  TEAM_LEADS_KEY,
  USERS_RECENT_ACTIVITY_KEY,
  USERS_ROLE_COUNT_KEY,
  USERS_SEARCH_KEY,
} from "~/lib/const";
import {
  createUser,
  getEmployees,
  getPagedUsers,
  getRecentActivity,
  getRoleBasedCount,
  getTeamLeads,
  getUserProfilePic,
  searchUsers,
  updateUser,
} from "../user.api";
import { handleApiError } from "~/lib/utils";
import type { NotificationApi } from "~/hooks/useAntNotification";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });
};

const invalidateKeys = [PROFILE_KEY, PROJECT_TEAM_KEY, PROFILE_PICTURE_KEY];

const invalidateUserKeys = [
  PAGED_USERS_KEY,
  USERS_RECENT_ACTIVITY_KEY,
  USERS_ROLE_COUNT_KEY,
  PROFILE_PICTURE_KEY,
];

export const useCreateUser = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (user: UserRequest) => {
      return await createUser(user);
    },
    onSuccess: () => {
      _api({ message: "User created successfully", type: "success" });
      invalidateUserKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      _api({ message: error.message, type: "error" });
    },
  });
};

export const useChangePassword = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (password: PasswordChangeRequest) => {
      return await changePassword(password);
    },
    onSuccess: () => {
      _api({ message: "Password changed successfully", type: "success" });
      invalidateUserKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      _api({ message: error.message, type: "error" });
    },
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
      invalidateKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update profile");
    },
  });
};

type UserUpdatePayload = {
  id: string;
  user: AdminUpdate;
};

export const useUserUpdate = (_api: NotificationApi) => {
  const query = useQueryClient();
  return useMutation<ApiResponse<User>, Error, UserUpdatePayload>({
    mutationFn: async ({ id, user }) => {
      return await updateUser(id, user);
    },
    onSuccess: () => {
      _api({ message: "User updated successfully", type: "success" });
      invalidateUserKeys.forEach((key) => {
        query.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update user");
    },
  });
};

export const usePagedUsersQuery = (
  pageNumber: number,
  pageSize: number,
  role?: UserRole,
  search?: string
) => {
  return useQuery({
    queryKey: [PAGED_USERS_KEY, pageNumber, pageSize, role, search],
    queryFn: async () => {
      const data = await getPagedUsers(pageNumber, pageSize, role, search);
      return data.result;
    },
    staleTime: STALE_TIME,
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

export const useUserSearchQuery = (query: string, role?: UserRole) => {
  return useQuery({
    queryKey: [USERS_SEARCH_KEY, query, role],
    queryFn: () => searchUsers(query, role),
  });
};

export const usePictureQuery = (userId: string) => {
  return useQuery({
    queryKey: [PROFILE_PICTURE_KEY, userId],
    queryFn: async () => {
      const data = await getUserProfilePic(userId);
      return data.result;
    },
    staleTime: STALE_TIME * 3, // 15 minutes
  });
};

export const useRecentActivityQuery = () => {
  return useQuery({
    queryKey: [USERS_RECENT_ACTIVITY_KEY],
    queryFn: async () => {
      const data = await getRecentActivity();
      return data.result;
    },
    staleTime: STALE_TIME,
  });
};

export const useRoleCountQuery = () => {
  return useQuery({
    queryKey: [USERS_ROLE_COUNT_KEY],
    queryFn: async () => {
      const data = await getRoleBasedCount();
      return data.result;
    },
    staleTime: STALE_TIME,
  });
};
