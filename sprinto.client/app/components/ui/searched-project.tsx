import { Avatar, Card, Col, Flex, Row } from "antd";
import type { FC, ReactNode } from "react";
import { truncateText } from "~/lib/utils";
import AvatarPic from "./avatar-pic";

import { NavLink } from "react-router";
import "~/styles/items.css";
import CustomTag from "./custom-tag";
import CustomTooltip from "./tooltip";
import ProjectTiming from "./project-timing";

interface SearchedProjectProps {
  project: Project;
  onClose: () => void;
}

/**
 * This component renders searched-project section
 * @param {SearchedProjectProps} props
 * @returns {ReactNode} The SearchedProject component
 */
const SearchedProject: FC<SearchedProjectProps> = ({
  project,
  onClose,
}: SearchedProjectProps): ReactNode => {
  return (
    <NavLink to={`/projects/${project.id}`}>
      <Card size="small" hoverable key={project.id} className="search-task">
        <Row align="middle" justify="space-between">
          <Col span={9}>
            <Flex align="center" gap={12}>
              <p className="text-primary-dark no-margin">{project.alias}</p>
              <p className="no-margin">
                <CustomTooltip title={project.title}>
                  {truncateText(project.title, 18)}
                </CustomTooltip>
              </p>
            </Flex>
          </Col>

          <Col span={8}>
            <ProjectTiming proj={project} small />
          </Col>

          <Col span={7}>
            <Flex align="center" justify="space-between">
              <Avatar.Group
                size={22}
                max={{
                  count: 2,
                }}
              >
                {project.assignees.map((assignee) => (
                  <AvatarPic size={22} user={assignee} key={assignee.id} />
                ))}
              </Avatar.Group>
              <CustomTag text={project.isCompleted ? "Completed" : "Active"} />
            </Flex>
          </Col>
        </Row>
      </Card>
    </NavLink>
  );
};

export default SearchedProject;
