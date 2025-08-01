import type { ReactNode } from "react";
import { useParams } from "react-router";
import { useProjectActivitiesQuery } from "~/lib/server/services";

/**
 * This component renders project-overview section
 * @returns {ReactNode} The ProjectOverview component
 */
const ProjectOverview = (): ReactNode => {
  const { projectId } = useParams();

  const { data: activities } = useProjectActivitiesQuery(projectId!);

  console.log(activities);

  return <div>ProjectOverview {projectId}</div>;
};

export default ProjectOverview;
