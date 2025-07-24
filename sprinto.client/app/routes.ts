import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  layout("layouts/main-layout.tsx", [route("today", "routes/today.tsx"),
    route("inbox", "routes/inbox.tsx"),
    route("upcoming", "routes/upcoming.tsx"),
    route("projects", "routes/projects.tsx"),
  ]),
] satisfies RouteConfig;
