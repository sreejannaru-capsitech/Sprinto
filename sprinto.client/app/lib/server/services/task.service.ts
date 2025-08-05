import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import {
  INBOX_TASKS_KEY,
  STALE_TIME,
  TASK_ACTIVITIES_KEY,
  TODAY_TASKS_KEY,
  UPCOMING_TASKS_KEY,
} from "~/lib/const";
// import { queryClient } from "../queryClient";
import { handleApiError } from "~/lib/utils";
import {
  createTask,
  getInboxTasks,
  getTaskActivities,
  getTodayTasks,
  getUpcomingTasks,
  updateTask,
} from "../task.api";

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

export const useUpcomingTasksQuery = () => {
  return useQuery({
    queryKey: [UPCOMING_TASKS_KEY],
    queryFn: getUpcomingTasks,
    staleTime: STALE_TIME,
  });
};

export const useTaskActivitiesQuery = (taskId: string) => {
  return useQuery({
    queryKey: [TASK_ACTIVITIES_KEY, taskId],
    queryFn: () => getTaskActivities(taskId),
    staleTime: STALE_TIME,
  });
};
