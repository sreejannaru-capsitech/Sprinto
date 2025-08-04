import { Avatar, Card, Flex, Tag } from "antd";
import dayjs from "dayjs";
import type { CSSProperties, FC, ReactNode } from "react";
import { getInitials } from "~/lib/utils";

import "~/styles/items.css";

interface TeamMemberProps {
  member: User;
}

const p_style: CSSProperties = {
  marginBlockEnd: 0,
  marginBlockStart: 0,
};

/**
 * This component renders team-member section
 * @param {TeamMemberProps} props
 * @returns {ReactNode} The TeamMember component
 */
const TeamMember: FC<TeamMemberProps> = ({
  member,
}: TeamMemberProps): ReactNode => {
  return (
    <Card size="small" hoverable className="member-item">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={10}>
          <Avatar size={36}>{getInitials(member.name)}</Avatar>
          <div>
            <p style={p_style}>{member.name}</p>
            <p style={p_style} className="text-primary-dark smaller-text">
              {member.email}
            </p>
          </div>
        </Flex>

        <Tag className="capitalize">
          {member.role === "teamLead" ? "Team Lead" : member.role}
        </Tag>

        <p style={p_style} className="smaller-text">
          <span className="text-primary-dark ">Joined on — </span>
          {dayjs(member.createdBy.time).format("Do MMM YYYY")}
        </p>
      </Flex>
    </Card>
  );
};

export default TeamMember;
