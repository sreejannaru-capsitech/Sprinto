import { Card, Col, Flex, Row } from "antd";
import dayjs from "dayjs";
import type { CSSProperties, FC, ReactNode } from "react";

import "~/styles/items.css";
import AvatarPic from "./avatar-pic";
import CustomTag from "./custom-tag";

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
      <Row align="middle" justify="space-between">
        <Col span={12}>
          <Flex align="center" gap={10}>
            <AvatarPic user={member} size={36} />
            <div>
              <p style={p_style}>{member.name}</p>
              <p style={p_style} className="text-primary-dark smaller-text">
                {member.email}
              </p>
            </div>
          </Flex>
        </Col>

        <CustomTag role={member.role} />

        <p style={p_style} className="smaller-text">
          <span className="text-primary-dark ">Joined on — </span>
          {dayjs(member.createdBy.time).format("Do MMM YYYY")}
        </p>
      </Row>
    </Card>
  );
};

export default TeamMember;
