export const BASE_URL = "http://localhost:5142/api" as const;

// Keys for storing in tanstack query cache
export const PROFILE_KEY = "profile" as const;
export const PROJECTS_KEY = "projects" as const;
export const EMPLOYEES_KEY = "employees" as const;
export const TEAM_LEADS_KEY = "teamLeads" as const;
export const ADMINS_KEY = "admins" as const;


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
