export const BASE_URL = "http://localhost:5142/api" as const;

export const PROFILE_KEY = "profile" as const;

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
