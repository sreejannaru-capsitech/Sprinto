import { type ReactNode } from "react";
import { type MetaArgs } from "react-router";
import ProjectOverview from "~/pages/project-overview.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Overview — Sprinto" },
    { name: "description", content: "View and manage your project overview" },
  ];
};

/**
 * This component renders project-overview section
 * @returns {ReactNode} The Overview component
 */
const Overview = (): ReactNode => {
  return <ProjectOverview />;
};

export default Overview;
