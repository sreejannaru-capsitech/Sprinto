import { Avatar, Card, Flex, Tag } from "antd";
import type { FC, ReactNode } from "react";
import { truncateText } from "~/lib/utils";
import AvatarPic from "./avatar-pic";

import "~/styles/items.css";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  const onClick = (project: Project) => {
    onClose();
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card
      onClick={() => onClick(project)}
      size="small"
      hoverable
      key={project.id}
      className="search-project"
    >
      <Flex align="center" justify="space-between">
        <p className="text-primary-dark no-margin">{project.alias}</p>
        <p className="no-margin">{truncateText(project.title, 35)}</p>

        <Flex align="center" gap={6}>
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
          <Tag>{project.isCompleted ? "Completed" : "Active"}</Tag>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SearchedProject;
