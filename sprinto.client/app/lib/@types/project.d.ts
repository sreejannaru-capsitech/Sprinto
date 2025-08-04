interface Project {
  id: string;
  title: string;
  alias: string;
  description: string;
  isCompleted?: boolean;
  startDate?: string;
  deadline?: string;
  teamLead: Assignee;
  assignees: Assignee[];
  createdBy: Creation;
}

interface ProjectRequest {
  title: string;
  alias: string;
  description: string;
  isCompleted: boolean;
  startDate?: string;
  deadline?: string;
  teamLead: Assignee;
  assignees: Assignee[];
}

interface ProjectTaskGroup {
  projectId: string;
  projectTitle: string;
  tasks: Task[];
}

interface TaskGroup {
  group: string;
  count: number;
}

interface ProjectOverview {
  totaltasks: number;
  pendingTasks: number;
  statusGroups: TaskGroup[];
  assigneeGroups: TaskGroup[];
  lastCompleted: Task[];
}
