import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { MetaArgs } from "react-router";
import { USER_ADMIN } from "~/lib/const";
import { ProjectIcon } from "~/lib/icons";
import type { RootState } from "~/lib/store";
import AdminProjectsPage from "~/pages/admin/projects";
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
  const user = useSelector((state: RootState) => state.user.user) as User;
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
      {user.role === USER_ADMIN ? (
        <AdminProjectsPage />
      ) : (
        <ProjectsPageComponent />
      )}
    </>
  );
};

export default ProjectsPage;
