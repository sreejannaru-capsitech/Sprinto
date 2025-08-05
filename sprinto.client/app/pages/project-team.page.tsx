import { Button, Flex, Popconfirm, Space, Typography } from "antd";
import type { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import Spinner from "~/components/ui/spinner";
import TeamMember from "~/components/ui/team-member";
import { useAntNotification } from "~/hooks";
import { AlertIcon, UserRemoveIcon } from "~/lib/icons";
import { useProjectTeamQuery, useRemoveMember } from "~/lib/server/services";
import type { RootState } from "~/lib/store/store";

/**
 * This component renders project-team.page section
 * @returns {ReactNode} The ProjectTeamPage component
 */
const ProjectTeamPage = (): ReactNode => {
  const proj = useSelector((state: RootState) => state.project.project);

  const { data, isPending } = useProjectTeamQuery(proj!.id);

  const user = useSelector((state: RootState) => state.user.user);

  const { _api, contextHolder } = useAntNotification();

  const { mutateAsync: removeMember } = useRemoveMember(_api);

  return (
    <Spinner isActive={isPending}>
      {contextHolder}
      <div style={{ marginTop: "3rem" }}>
        <TeamMember member={data?.result?.teamLead!} />
        <Typography.Title
          level={4}
          className="font-bold"
          style={{ marginTop: "1rem" }}
        >
          Employees
        </Typography.Title>
        {data?.result?.employees.length ? (
          <Space
            direction="vertical"
            size={16}
            className="team-member-container"
          >
            {data?.result?.employees.map((member) => (
              <Flex key={member.id} align="center" gap={10}>
                <TeamMember member={member} />
                {/* Only show the button if the user is not an employee */}
                {user?.role !== "employee" ? (
                  <Popconfirm
                    title="Are you sure you want to remove this member?"
                    icon={<AlertIcon size={18} />}
                    onConfirm={() =>
                      removeMember({ projectId: proj!.id, memberId: member.id })
                    }
                  >
                    <Button
                      icon={<UserRemoveIcon />}
                      style={{ height: 64.5, width: 65, borderRadius: 18 }}
                    />
                  </Popconfirm>
                ) : null}
              </Flex>
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
