import { Avatar, Col, Flex, Row, Space, Tag, Typography } from "antd";
import type { FC, ReactNode } from "react";
import ActivityItem from "~/components/ui/activity-item";
import ProjectTiming from "~/components/ui/project-timing";
import ToolTip from "~/components/ui/tooltip";
import {
  useProjectActivitiesQuery,
  useProjectTasksQuery,
} from "~/lib/server/services";
import { getInitials } from "~/lib/utils";

import "~/styles/project-overview.css";

interface ProjectOverviewProps {
  proj: Project;
}

/**
 * This component renders project-overview.page section
 * @param {ProjectOverviewProps} props
 * @returns {ReactNode} The ProjectOverview component
 */
const ProjectOverview: FC<ProjectOverviewProps> = ({
  proj,
}: ProjectOverviewProps): ReactNode => {
  const { data: activities } = useProjectActivitiesQuery(proj.id);
  const { data: tasks } = useProjectTasksQuery(proj.id);

  return (
    <Row gutter={50} wrap={false}>
      <Col flex={"auto"}>
        <Flex align="center" justify="space-between">
          {/* Title and Timing */}
          <Flex align="center" gap={20}>
            <Typography.Title level={2}>
              {proj.title}
              <span> — </span>
              <span className="text-primary-dark">{proj.alias}</span>
            </Typography.Title>

            <Flex gap={4} align="center" justify="center">
              <ProjectTiming proj={proj} />
            </Flex>
          </Flex>

          {/* Project Assignees & Team Lead */}
          <Flex align="center" gap={20}>
            <Flex align="center" gap={4}>
              <Avatar.Group
                max={{
                  count: 4,
                  style: { color: "black", backgroundColor: "white" },
                }}
              >
                {proj.assignees.map((assignee) => (
                  <Avatar key={assignee.id}>
                    <ToolTip title={assignee.name}>
                      <span className="small-text">
                        {getInitials(assignee.name)}
                      </span>
                    </ToolTip>
                  </Avatar>
                ))}
                <Avatar key={proj.teamLead.id}>
                  <ToolTip title={proj.teamLead.name}>
                    <span className="small-text">
                      {getInitials(proj.teamLead.name)}
                    </span>
                  </ToolTip>
                </Avatar>
              </Avatar.Group>
            </Flex>
            <Tag style={{ padding: "4px 8px", fontSize: 14, borderRadius: 9 }}>
              Team Lead - {proj.teamLead.name}
            </Tag>
          </Flex>
        </Flex>
        <div className="project-description">
          <Typography.Paragraph>{proj.description}</Typography.Paragraph>
        </div>
      </Col>
      <Col flex={"410px"}>
        <Typography.Title level={2}>Timeline</Typography.Title>
        <div className="activity-container">
          <Space
            direction="vertical"
            size={16}
            className="activity-container-inner"
          >
            {activities?.result?.map((a) => (
              <ActivityItem key={a.activity.id} item={a} />
            ))}
          </Space>
        </div>
      </Col>
    </Row>
  );
};

export default ProjectOverview;
