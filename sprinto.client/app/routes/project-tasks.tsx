import { Flex, Typography } from "antd";
import { type ReactNode } from "react";
import { type MetaArgs } from "react-router";
import { TaskIcon } from "~/lib/icons";
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

  return (
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
      <ProjectTasksPage />
    </>
  );
};

export default ProjectTasks;
