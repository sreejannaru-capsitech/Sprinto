import { Space, Typography } from "antd";
import type { FC, ReactNode } from "react";
import Spinner from "~/components/ui/spinner";
import TeamMember from "~/components/ui/team-member";
import { useProjectTeamQuery } from "~/lib/server/services";

interface ProjectTeamProps {
  proj: Project;
}

/**
 * This component renders project-team.page section
 * @returns {ReactNode} The ProjectTeamPage component
 */
const ProjectTeamPage: FC<ProjectTeamProps> = ({
  proj,
}: ProjectTeamProps): ReactNode => {
  const { data, isPending } = useProjectTeamQuery(proj.id);

  return (
    <Spinner isActive={isPending}>
      <div style={{ marginTop: "3rem" }}>
        <TeamMember member={data?.result?.teamLead!} />
        <Typography.Title level={4} className="font-bold">
          Employees
        </Typography.Title>
        {data?.result?.employees.length ? (
          <Space
            direction="vertical"
            size={16}
            className="team-member-container"
          >
            {data?.result?.employees.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </Space>
        ) : (
          <p className="text-primary-dark">No employees found</p>
        )}
      </div>
    </Spinner>
  );
};

export default ProjectTeamPage;
