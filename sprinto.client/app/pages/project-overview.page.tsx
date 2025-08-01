import { Col, Row, Space, Typography } from "antd";
import type { FC, ReactNode } from "react";
import ActivityItem from "~/components/ui/activity-item";
import { useProjectActivitiesQuery } from "~/lib/server/services";

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

  return (
    <Row gutter={50} wrap={false}>
      <Col flex={"auto"}>
        <Typography.Title level={2}>
          {proj.title}
        </Typography.Title>
        <div className="project-description">
          <Typography.Paragraph>{proj.description}</Typography.Paragraph>
        </div>
      </Col>
      <Col flex={"410px"}>
        <Typography.Title level={2}>
          Timeline
        </Typography.Title>
        <div className="activity-container">
          <Space direction="vertical" size={16} className="activity-container-inner">
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
