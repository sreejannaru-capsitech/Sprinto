type ActivityType =
  | "TaskCreated"
  | "TitleUpdated"
  | "DescUpdated"
  | "ProjectUpdated"
  | "AssigneeAdded"
  | "AssigneeRemoved"
  | "DuedateUpdated"
  | "StatusUpdated"
  | "PriorityUpdated"
  | "TaskDeleted";

interface Activity {
  id: string;
  action: ActivityType;
  createdBy: Creation;
  title: {
    previous: string;
    current: string;
  } | null;
  description: {
    previous: string | null;
    current: string;
  } | null;
  dueDate: {
    previous: string;
    current: string;
  } | null;
  assignee: {
    previous: Assignee[];
    current: Assignee[];
  } | null;
  status: {
    previous: StatusEntity;
    current: StatusEntity;
  } | null;
  priority: {
    previous: TaskPriority;
    current: TaskPriority;
  } | null;
}

interface TaskActivity {
  sequence: number;
  projectAlias: string;
  taskId: string;
  projectId: string;
  activity: Activity;
}