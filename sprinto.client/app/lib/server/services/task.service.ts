import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import {
  ALL_TASKS_KEY,
  INBOX_TASKS_KEY,
  PROJECT_ACTIVITIES_KEY,
  PROJECT_OVERVIEW_KEY,
  PROJECT_TASKS_KEY,
  STALE_TIME,
  TASK_ACTIVITIES_KEY,
  TASK_STATISTICS_KEY,
  TASKS_SEARCH_KEY,
  TODAY_TASKS_KEY,
  TOP_DUE_TASKS_KEY,
  UPCOMING_TASKS_KEY,
} from "~/lib/const";
// import { queryClient } from "../queryClient";
import { handleApiError } from "~/lib/utils";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getInboxTasks,
  getTaskActivities,
  getTaskStatistics,
  getTodayTasks,
  getTopDueTasks,
  getUpcomingTasks,
  searchTasks,
  updateTask,
} from "../task.api";

const invalidateKeys = [
  TODAY_TASKS_KEY,
  INBOX_TASKS_KEY,
  TASK_ACTIVITIES_KEY,
  TOP_DUE_TASKS_KEY,
  UPCOMING_TASKS_KEY,
  PROJECT_TASKS_KEY,
  ALL_TASKS_KEY,
  TASK_STATISTICS_KEY,
];

const ivalidateProjects = [
  PROJECT_OVERVIEW_KEY,
  PROJECT_ACTIVITIES_KEY,
  PROJECT_TASKS_KEY,
];

export const useCreateTask = (_api: NotificationApi) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: TaskItemRequest) => {
      return await createTask(task);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "Task created successfully", type: "success" });
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      ivalidateProjects.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key, vars.projectId],
          exact: true,
        });
      });
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
    onSuccess: (_res, vars) => {
      _api({ message: "Task updated successfully", type: "success" });
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      ivalidateProjects.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key, vars.task.projectId],
          exact: true,
        });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update task");
    },
  });
};

export const useDeleteTask = (_api: NotificationApi) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<string>, Error, string>({
    mutationFn: async (taskId) => {
      return await deleteTask(taskId);
    },
    onSuccess: (_res, vars) => {
      _api({ message: "Task deleted successfully", type: "success" });
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      ivalidateProjects.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not delete task");
    },
  });
};

export const useAllTasksQuery = (
  pageNumber: number,
  pageSize: number,
  priority?: TaskPriority,
  status?: string
) => {
  return useQuery({
    queryKey: [ALL_TASKS_KEY, pageNumber, pageSize, priority, status],
    queryFn: async () =>
      await getAllTasks(pageNumber, pageSize, priority, status),
    staleTime: STALE_TIME,
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

export const useTasksSearchQuery = (query: string) => {
  return useQuery({
    queryKey: [TASKS_SEARCH_KEY, query],
    queryFn: () => searchTasks(query),
  });
};

export const useTopDueTasksQuery = () => {
  return useQuery({
    queryKey: [TOP_DUE_TASKS_KEY],
    queryFn: getTopDueTasks,
    staleTime: STALE_TIME,
  });
};

export const useTaskStatsQuery = () => {
  return useQuery({
    queryKey: [TASK_STATISTICS_KEY],
    queryFn: getTaskStatistics,
    staleTime: STALE_TIME,
  });
};
