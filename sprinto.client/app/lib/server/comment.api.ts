import axiosApi from ".";

export const createComment = async (
  comment: CommentRequest,
  taskId: string
) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    `/tasks/${taskId}/comments`,
    comment
  );
  return data;
};

export const getComments = async (taskId: string) => {
  const { data } = await axiosApi.get<ApiResponse<Comment[]>>(
    `/tasks/${taskId}/comments`
  );
  return data;
};

export const updateComment = async (
  comment: CommentRequest,
  taskId: string,
  commentId: string
) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    `/tasks/${taskId}/comments/${commentId}`,
    comment
  );
  return data;
};

export const deleteComment = async (taskId: string, commentId: string) => {
  const { data } = await axiosApi.post<ApiResponse<string>>(
    `/tasks/${taskId}/comments/${commentId}/delete`
  );
  return data;
};
