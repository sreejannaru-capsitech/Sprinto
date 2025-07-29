import { useMutation } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import { TASKS_KEY } from "~/lib/const";
import { queryClient } from "../queryClient";
import { createTask } from "../task.api";
import { handleApiError } from "~/lib/utils";

export const useCreateTask = (_api: NotificationApi) => {
  return useMutation({
    mutationFn: async (task: TaskItemRequest) => {
      return await createTask(task);
    },
    onSuccess: () => {
      _api({ message: "Task created successfully", type: "success" });
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not create task");
    },
  });
};
