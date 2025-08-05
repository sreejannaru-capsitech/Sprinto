import { Button, Flex, Typography } from "antd";
import { useMemo, type ReactNode } from "react";
import { useParams, type MetaArgs } from "react-router";
import Spinner from "~/components/ui/spinner";
import { TaskIcon } from "~/lib/icons";
import { useProjectsQuery } from "~/lib/server/services";
import { isValidMongoId } from "~/lib/utils";
import ProjectTasksPage from "~/pages/project-tasks.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Tasks — Sprinto" },
    { name: "description", content: "View and manage tasks for your project" },
  ];
};

/**
 * This component renders project-tasks section
 * @returns {ReactNode} The ProjectTasks component
 */
const ProjectTasks = (): ReactNode => {
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
          <Flex align="center" gap={6}>
            <TaskIcon size={36} />
            <Typography.Title
              level={2}
              className="text-primary-dark"
              style={{ margin: 0 }}
            >
              Tasks
            </Typography.Title>
          </Flex>
          <ProjectTasksPage proj={project} />
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

export default ProjectTasks;
