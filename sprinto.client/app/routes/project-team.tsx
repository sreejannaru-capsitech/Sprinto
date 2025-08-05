import { Button, Flex, Typography } from "antd";
import { useMemo, type ReactNode } from "react";
import { useParams, type MetaArgs } from "react-router";
import AddAssignee from "~/components/ui/add-assignee";
import Spinner from "~/components/ui/spinner";
import { UsersIcon } from "~/lib/icons";
import { useProjectsQuery } from "~/lib/server/services";
import { isValidMongoId } from "~/lib/utils";
import ProjectTeamPage from "~/pages/project-team.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Team — Sprinto" },
    { name: "description", content: "All members of the project team" },
  ];
};

/**
 * This component renders project-tasks section
 * @returns {ReactNode} The ProjectTeam component
 */
const ProjectTeam = (): ReactNode => {
  const { projectId } = useParams();
  const { data, isPending } = useProjectsQuery();

  const project = useMemo(() => {
    if (!isValidMongoId(projectId)) return undefined;
    return data?.result?.find((p) => p.id === projectId);
  }, [data, projectId]);

  return (
    <Spinner isActive={isPending}>
      {project ? (
        <>
          <Flex align="center" justify="space-between" style={{ width: 600 }}>
            <Flex align="center" gap={6}>
              <UsersIcon size={36} />
              <Typography.Title
                level={2}
                className="text-primary-dark"
                style={{ margin: 0 }}
              >
                Team
              </Typography.Title>
            </Flex>
            <AddAssignee />
          </Flex>
          <ProjectTeamPage proj={project} />
        </>
      ) : (
        <Flex align="center" gap={10}>
          <Button onClick={() => window.history.back()}>Back</Button>
          <div>The project does not exist</div>
        </Flex>
      )}
    </Spinner>
  );
};

export default ProjectTeam;
