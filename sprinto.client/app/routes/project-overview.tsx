import { useMemo, type ReactNode } from "react";
import { useParams } from "react-router";
import Spinner from "~/components/ui/spinner";
import { useProjectsQuery } from "~/lib/server/services";
import { isValidMongoId } from "~/lib/utils";
import ProjectOverview from "~/pages/project-overview.page";

/**
 * This component renders project-overview section
 * @returns {ReactNode} The Overview component
 */
const Overview = (): ReactNode => {
  const { projectId } = useParams();
  const { data, isPending } = useProjectsQuery();

  const project = useMemo(() => {
    if (!isValidMongoId(projectId)) return undefined;
    return data?.result?.find((p) => p.id === projectId);
  }, [data]);

  return (
    <Spinner isActive={isPending}>
      {project ? (
        <ProjectOverview proj={project} />
      ) : (
        <div>Project not found</div>
      )}
    </Spinner>
  );
};

export default Overview;
