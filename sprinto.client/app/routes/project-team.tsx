import { type ReactNode } from "react";
import { type MetaArgs } from "react-router";
import PageTitle from "~/components/page-title";
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
      <PageTitle title="Team" icon={<UsersIcon size={36} />} width={600}>
        <AddAssignee />
      </PageTitle>
      <ProjectTeamPage />
    </>
  );
};

export default ProjectTeam;
