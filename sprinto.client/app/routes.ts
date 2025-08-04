import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/root-layout.tsx", [index("routes/home.tsx")]),

  layout("layouts/main-layout.tsx", [
    route("today", "routes/today.tsx"),
    route("inbox", "routes/inbox.tsx"),
    route("upcoming", "routes/upcoming.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/:projectId", "routes/project-overview.tsx"),
    route("projects/:projectId/tasks", "routes/project-tasks.tsx"),
    route("projects/:projectId/team", "routes/project-team.tsx"), 
  ]),
] satisfies RouteConfig;
