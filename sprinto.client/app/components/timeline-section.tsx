import { Col, Space, Typography } from "antd";
import type { FC, ReactNode } from "react";

import "~/styles/project-overview.css";
import ActivityItem from "./ui/activity-item";

interface TimeLineSectionProps {
  activities: TaskActivity[];
}

/**
 * This component renders timeline-section section
 * @param {TimeLineSectionProps} props
 * @returns {ReactNode} The TimeLineSection component
 */
const TimeLineSection: FC<TimeLineSectionProps> = ({
  activities,
}: TimeLineSectionProps): ReactNode => {
  return (
    <Col flex={"410px"}>
      <Typography.Title level={2}>Timeline</Typography.Title>
      <div className="activity-container">
        <Space
          direction="vertical"
          size={16}
          className="activity-container-inner"
        >
          {activities.length ? (
            <>
              {activities.map((a) => (
                <ActivityItem key={a.activity.id} item={a} />
              ))}
            </>
          ) : (
            <p style={{ margin: 10 }} className="text-primary-dark">
              No activity so far
            </p>
          )}
        </Space>
      </div>
    </Col>
  );
};

export default TimeLineSection;
