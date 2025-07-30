type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  projectAlias: string;
  sequence: number;
  description?: string;
  projectId: string;
  assignees: Assignee[];
  dueDate: string;
  status: StatusEntity;
  priority: TaskPriority;
  comments: [];
  createdBy: Creation;
}

interface TaskItemRequest {
  title: string;
  description?: string;
  projectId: string;
  assignees: Assignee[];
  dueDate: string;
  status: StatusEntity;
  priority: TaskPriority;
}

interface TodayTasks {
  today: Task[];
  overdue: Task[];
}
