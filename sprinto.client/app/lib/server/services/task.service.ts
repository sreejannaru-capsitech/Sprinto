import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import {
  INBOX_TASKS_KEY,
  STALE_TIME,
  TASKS_KEY,
  TODAY_TASKS_KEY,
} from "~/lib/const";
// import { queryClient } from "../queryClient";
import {
  createTask,
  getInboxTasks,
  getTodayTasks,
  updateTask,
} from "../task.api";
import { handleApiError } from "~/lib/utils";

export const useCreateTask = (_api: NotificationApi) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: TaskItemRequest) => {
      return await createTask(task);
    },
    onSuccess: () => {
      _api({ message: "Task created successfully", type: "success" });
      queryClient.invalidateQueries({ queryKey: [TODAY_TASKS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not create task");
    },
  });
};

type UpdateTaskPayload = {
  id: string;
  task: TaskItemRequest;
};

export const useUpdateTask = (_api: NotificationApi) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Task>, Error, UpdateTaskPayload>({
    mutationFn: async ({ id, task }) => {
      return await updateTask(id, task);
    },
    onSuccess: () => {
      _api({ message: "Task updated successfully", type: "success" });
      queryClient.invalidateQueries({ queryKey: [TODAY_TASKS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update task");
    },
  });
};

export const useTodayTaskQuery = () => {
  return useQuery({
    queryKey: [TODAY_TASKS_KEY],
    queryFn: getTodayTasks,
    staleTime: STALE_TIME,
  });
};

export const useInboxTasksQuery = () => {
  return useQuery({
    queryKey: [INBOX_TASKS_KEY],
    queryFn: getInboxTasks,
    staleTime: STALE_TIME,
  });
};
