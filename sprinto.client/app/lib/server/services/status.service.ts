import { STALE_TIME, STATUSES_KEY } from "~/lib/const";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStatus,
  deleteStatus,
  getStatuses,
  updateStatus,
} from "../task-status.api";
import type { NotificationApi } from "~/hooks/useAntNotification";
import { handleApiError } from "~/lib/utils";

export const useStatusesQuery = () => {
  return useQuery({
    queryKey: [STATUSES_KEY],
    queryFn: getStatuses,
    staleTime: STALE_TIME,
  });
};

export const useCreateStatus = (_api: NotificationApi) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: StatusRequest) => {
      return await createStatus(status);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "New status was added", type: "success" });
      queryClient.invalidateQueries({ queryKey: [STATUSES_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not create status");
    },
  });
};

export const useUpdateStatus = (_api: NotificationApi) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: Status) => {
      return await updateStatus(status.id, status);
    },
    onSuccess: (_res) => {
      _api({ message: "Status was updated", type: "success" });
      queryClient.invalidateQueries({ queryKey: [STATUSES_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update status");
    },
  });
};

export const useDeleteStatus = (_api: NotificationApi) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteStatus(id);
    },
    onSuccess: (_res) => {
      _api({ message: "Status was deleted", type: "success" });
      queryClient.invalidateQueries({ queryKey: [STATUSES_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not delete status");
    },
  });
};
