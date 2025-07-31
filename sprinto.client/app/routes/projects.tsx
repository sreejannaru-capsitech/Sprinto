import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import { ProjectIcon } from "~/lib/icons";
import ProjectsPageComponent from "~/pages/projects.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Projects — Sprinto" },
    { name: "description", content: "Manage all your projects with Sprinto" },
  ];
};

/**
 * This component renders projects section
 * @returns {ReactNode} The ProjectsPage component
 */
const ProjectsPage = (): ReactNode => {
  return (
    <>
      <Flex align="center" gap={6}>
        <ProjectIcon size={36} />
        <Typography.Title
          level={2}
          className="text-primary-dark"
          style={{ margin: 0 }}
        >
          Projects
        </Typography.Title>
      </Flex>
      <ProjectsPageComponent />
    </>
  );
};

export default ProjectsPage;
