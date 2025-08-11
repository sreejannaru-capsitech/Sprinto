import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationApi } from "~/hooks/useAntNotification";
import { COMMENTS_KEY, STALE_TIME } from "~/lib/const";
import { handleApiError } from "~/lib/utils";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../comment.api";

type CommentCreatePayload = {
  taskId: string;
  comment: CommentRequest;
};

type CommentUpdatePayload = {
  taskId: string;
  commentId: string;
  comment: CommentRequest;
};

type CommentDeletePayload = {
  taskId: string;
  commentId: string;
};

export const useCreateComment = (_api: NotificationApi) => {
  const query = useQueryClient();

  return useMutation<ApiResponse<string>, Error, CommentCreatePayload>({
    mutationFn: async ({ comment, taskId }) => {
      return await createComment(comment, taskId);
    },
    onSuccess: (_res, variables) => {
      _api({ message: "Your comment was added", type: "success" });
      query.invalidateQueries({ queryKey: [COMMENTS_KEY, variables.taskId] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not create comment");
    },
  });
};

export const useCommentsQuery = (_api: NotificationApi, taskId: string) => {
  return useQuery({
    queryKey: [COMMENTS_KEY, taskId],
    queryFn: async () => await getComments(taskId),
    staleTime: STALE_TIME,
  });
};

export const useUpdateComment = (_api: NotificationApi) => {
  const query = useQueryClient();

  return useMutation<ApiResponse<string>, Error, CommentUpdatePayload>({
    mutationFn: async ({ comment, taskId, commentId }) => {
      return await updateComment(comment, taskId, commentId);
    },
    onSuccess: (_res, variables) => {
      _api({ message: "Comment was updated", type: "success" });
      query.invalidateQueries({ queryKey: [COMMENTS_KEY, variables.taskId] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not update comment");
    },
  });
};

export const useDeleteComment = (_api: NotificationApi) => {
  const query = useQueryClient();

  return useMutation<ApiResponse<string>, Error, CommentDeletePayload>({
    mutationFn: async ({ taskId, commentId }) => {
      return await deleteComment(taskId, commentId);
    },
    onSuccess: (_res, variables) => {
      _api({ message: "Your comment was deleted", type: "success" });
      query.invalidateQueries({ queryKey: [COMMENTS_KEY, variables.taskId] });
    },
    onError: (error) => {
      handleApiError(error, _api, "Could not delete comment");
    },
  });
};
