import { Button, Flex } from "antd";
import { useMemo, type ReactNode } from "react";
import { useParams, type MetaArgs } from "react-router";
import Spinner from "~/components/ui/spinner";
import { useProjectsQuery } from "~/lib/server/services";
import { isValidMongoId } from "~/lib/utils";
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
  const { projectId } = useParams();
  const { data, isPending } = useProjectsQuery();

  const project = useMemo(() => {
    if (!isValidMongoId(projectId)) return undefined;
    return data?.result?.find((p) => p.id === projectId);
  }, [data, projectId]);

  return (
    <Spinner isActive={isPending}>
      {project ? (
        <ProjectOverview proj={project} />
      ) : (
        <Flex align="center" gap={10}>
          <Button onClick={() => window.history.back()}>Back</Button>
          <div>The project does not exist</div>
        </Flex>
      )}
    </Spinner>
  );
};

export default Overview;
