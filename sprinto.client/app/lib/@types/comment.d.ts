interface CommentRequest {
  content: string;
  isEdited?: boolean;
  updatedAt?: string;
}

interface Comment extends CommentRequest {
  id: string;
  createdBy: Creation;
}
