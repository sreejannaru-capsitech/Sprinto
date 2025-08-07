import { Avatar, Card, Col, Flex, Row, Tag, Typography } from "antd";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import type { FC, ReactNode } from "react";
import { ArchiveIcon } from "~/lib/icons";
import { truncateText } from "~/lib/utils";

import dayjs from "dayjs";
import { NavLink } from "react-router";
import "~/styles/items.css";
import AvatarPic from "./avatar-pic";
import ProjectTiming from "./project-timing";

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
    <NavLink to={`/projects/${project.id}`}>
      <Card hoverable size="small" className="project-item">
        {/* Project Card Header */}
        <Flex
          align="center"
          justify="space-between"
          className="task-item-header"
        >
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
                <ProjectTiming proj={project} />
              </Tag>
              <Flex align="center">
                <Avatar.Group
                  size={24}
                  max={{
                    count: 2,
                  }}
                >
                  {project.assignees.map((assignee) => (
                    <AvatarPic key={assignee.id} user={assignee} size={24} />
                  ))}
                </Avatar.Group>
              </Flex>
            </Flex>
          </Col>
        </Row>
      </Card>
    </NavLink>
  );
};

export default ProjectItem;
