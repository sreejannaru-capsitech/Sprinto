export const BASE_URL = "http://localhost:5142/api" as const;

// Keys for storing in tanstack query cache
export const PROFILE_KEY = "profile" as const;
export const PROJECTS_KEY = "projects" as const;
export const ASSIGNED_PROJECTS_KEY = "assignedProjects" as const;
export const EMPLOYEES_KEY = "employees" as const;
export const TEAM_LEADS_KEY = "teamLeads" as const;
export const ADMINS_KEY = "admins" as const;
export const STATUSES_KEY = "statuses" as const;
export const TASKS_KEY = "tasks" as const;
export const TODAY_TASKS_KEY = "todayTasks" as const;
export const INBOX_TASKS_KEY = "inboxTasks" as const;

export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const SIDEBAR_ROUTES = [
  "Today",
  "Inbox",
  "Upcoming",
  "Projects",
] as const;

export const ADMIN_ROUTES = [
  "Deadlines",
  "Projects",
  "Tasks",
  "Employees",
  "TeamLeads",
  "Admins",
] as const;

export const USER_ROLES: UserRole[] = [
  "admin",
  "teamLead",
  "employee",
] as const;
