import { Flex, Typography } from "antd";
import { type ReactNode } from "react";
import { type MetaArgs } from "react-router";
import AddAssignee from "~/components/ui/add-assignee";
import { UsersIcon } from "~/lib/icons";
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
  return (
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
      <ProjectTeamPage />
    </>
  );
};

export default ProjectTeam;
