import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Home and Login Route
  layout("layouts/root-layout.tsx", [index("routes/home.tsx")]),

  // Employee & Team Lead Routes
  layout("layouts/protected-layout.tsx", [
    route("today", "routes/today.tsx"),
    route("inbox", "routes/inbox.tsx"),
    route("upcoming", "routes/upcoming.tsx"),
    route("projects", "routes/projects.tsx"),

    layout("layouts/project-layout.tsx", [
      route("projects/:projectId", "routes/project-overview.tsx"),
      route("projects/:projectId/tasks", "routes/project-tasks.tsx"),
      route("projects/:projectId/tasks/:taskId", "routes/task-details.tsx"),
      route("projects/:projectId/team", "routes/project-team.tsx"),
    ]),
  ]),

  // Admin Only Routes
  layout("layouts/admin-layout.tsx", [
    route("deadlines", "routes/admin/deadline.tsx"),
    route("tasks", "routes/admin/tasks.tsx"),
    route("users", "routes/admin/employees.tsx"),
  ]),

  // Not Found Route
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
