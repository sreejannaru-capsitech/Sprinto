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
  teamLead: string;
  assignees: string[];
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

interface ProjectTeam {
  teamLead: User;
  employees: User[];
}

interface AllProjects {
  total: number;
  active: number;
  inActive: number;
  projects: Project[];
}

interface TopProjects {
  id: string;
  title: string;
  alias: string;
  activityCount: number;
  maintainer: Assignee;
  startDate?: string;
  deadline?: string;
}

interface ProjectAssigneeCount extends Omit<Creation, "time"> {
  projectsCount: number;
}
