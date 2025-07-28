type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  sequence: number;
  description: string;
  projectId: string;
  assignees: Assignee[];
  dueDate: string;
  status: StatusEntity;
  priority: TaskPriority;
  comments: [];
  activities: [];
  createdBy: Creation;
}

interface TaskItemRequest {
  title: string;
  description: string;
  projectId: string;
  assignees: Assignee[];
  dueDate: string;
  status: StatusEntity;
  priority: TaskPriority;
}