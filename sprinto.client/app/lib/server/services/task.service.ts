import { useMutation, useQuery } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import { STALE_TIME, TASKS_KEY, TODAY_TASKS_KEY } from "~/lib/const";
import { queryClient } from "../queryClient";
import { createTask, getTodayTasks, updateTask } from "../task.api";
import { handleApiError } from "~/lib/utils";

export const useCreateTask = (_api: NotificationApi) => {
  return useMutation({
    mutationFn: async (task: TaskItemRequest) => {
      return await createTask(task);
    },
    onSuccess: () => {
      _api({ message: "Task created successfully", type: "success" });
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY, TODAY_TASKS_KEY] });
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
  return useMutation<ApiResponse<Task>, Error, UpdateTaskPayload>({
    mutationFn: async ({ id, task }) => {
      return await updateTask(id, task);
    },
    onSuccess: () => {
      _api({ message: "Task updated successfully", type: "success" });
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY, TODAY_TASKS_KEY] });
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
