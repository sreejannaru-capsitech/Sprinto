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
  comments: Comment[];
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

interface InboxTasks {
  low: Task[];
  medium: Task[];
  high: Task[];
}

interface TaskContributor {
  name: string;
  count: number;
}

interface TaskStatistics {
  totalTasks: number;
  statusBreakdown: PieData[];
  projectInsight: PieData[];
  topContributors: TaskContributor[];
}
