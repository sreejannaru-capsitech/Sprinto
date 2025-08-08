export const BASE_URL = "http://localhost:5142/api" as const;

// Keys for storing in tanstack query cache

// Users
export const PROFILE_KEY = "profile" as const;
export const EMPLOYEES_KEY = "employees" as const;
export const TEAM_LEADS_KEY = "teamLeads" as const;
export const ADMINS_KEY = "admins" as const;
export const USERS_SEARCH_KEY = "usersSearch" as const;
export const PROFILE_PICTURE_KEY = "profilePicture" as const;

// Tasks
export const TASKS_KEY = "tasks" as const;
export const TASK_ACTIVITIES_KEY = "taskActivities" as const;
export const TODAY_TASKS_KEY = "todayTasks" as const;
export const INBOX_TASKS_KEY = "inboxTasks" as const;
export const TASKS_SEARCH_KEY = "tasksSearch" as const;
export const UPCOMING_TASKS_KEY = "upcomingTasks" as const;
export const TOP_DUE_TASKS_KEY = "topDueTasks" as const;
export const COMMENTS_KEY = "comments" as const;

// Projects
export const PROJECTS_KEY = "projects" as const;
export const PROJECT_TEAM_KEY = "projectTeam" as const;
export const PROJECT_OVERVIEW_KEY = "projectOverview" as const;
export const PROJECT_ACTIVITIES_KEY = "projectActivities" as const;
export const PROJECT_TASKS_KEY = "projectTasks" as const;

// Configuration
export const STATUSES_KEY = "statuses" as const;
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

export const USER_EMPLOYEE = "employee" as const;
export const USER_ADMIN = "admin" as const;
export const USER_TEAM_LEAD = "teamLead" as const;

export const USER_ROLES: UserRole[] = [
  USER_EMPLOYEE,
  USER_ADMIN,
  USER_TEAM_LEAD,
] as const;
