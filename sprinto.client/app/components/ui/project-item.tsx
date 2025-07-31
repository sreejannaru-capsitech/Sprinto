import { Avatar, Card, Col, Flex, Row, Tag, Typography } from "antd";
import type { FC, ReactNode } from "react";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import ToolTip from "./tooltip";
import { getInitials, truncateText } from "~/lib/utils";
import { ArchiveIcon, CalenderIcon, HourGlassIcon } from "~/lib/icons";

import "~/styles/items.css";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

interface ProjectItemProps {
  project: Project;
}

/**
 * This component renders project-item section
 * @param {ProjectItemProps} props
 * @returns {ReactNode} The ProjectItem component
 */
const ProjectItem: FC<ProjectItemProps> = ({
  project,
}: ProjectItemProps): ReactNode => {
  return (
    <Card hoverable size="small" className="project-item">
      {/* Project Card Header */}
      <Flex align="center" justify="space-between" className="task-item-header">
        <Typography.Text className="text-primary font-bolder smaller-text">
          {project.alias}
        </Typography.Text>
        <Tag>Managed By — {project.teamLead.name}</Tag>
      </Flex>

      {/* Project Card Body */}
      <Row gutter={0}>
        <Col span={2} style={{ paddingTop: 8 }}>
          <ArchiveIcon size={22} />
        </Col>
        <Col span={21}>
          <Typography.Title
            style={{ marginBlockEnd: 6, marginBlockStart: 5 }}
            level={4}
            className="font-bolder"
          >
            {project.title}
          </Typography.Title>
          <Typography.Paragraph
            style={{ maxWidth: 325 }}
            className="text-primary smaller-text"
          >
            {project.description ? truncateText(project.description, 95) : ""}
          </Typography.Paragraph>
          <Flex align="center" justify="space-between">
            <Tag style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CalenderIcon size={15} />
              {project.startDate || project.deadline ? (
                <>
                  <span>
                    {project.startDate
                      ? dayjs.utc(project.startDate).format("Do MMMM")
                      : "Not Started"}
                  </span>
                  <span style={{ margin: "0 4px" }}>—</span>
                  <span>
                    {project.deadline
                      ? dayjs.utc(project.deadline).format("Do MMMM")
                      : "Not Decided"}
                  </span>
                </>
              ) : (
                <span>Not Started Yet</span>
              )}
            </Tag>
            <Flex align="center">
              {project.assignees.map((assignee) => (
                <Avatar.Group
                  key={assignee.id}
                  max={{
                    count: 2,
                    style: { color: "black", backgroundColor: "white" },
                  }}
                >
                  <Avatar size={18}>
                    <ToolTip title={assignee.name}>
                      <span className="small-text">
                        {getInitials(assignee.name)}
                      </span>
                    </ToolTip>
                  </Avatar>
                </Avatar.Group>
              ))}
            </Flex>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

export default ProjectItem;
