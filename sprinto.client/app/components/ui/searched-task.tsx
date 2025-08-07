import { Avatar, Card, Flex, Tag } from "antd";
import type { FC, ReactNode } from "react";
import { truncateText } from "~/lib/utils";
import AvatarPic from "./avatar-pic";

import "~/styles/items.css";
import { useNavigate } from "react-router";

interface SearchedTaskProps {
  task: Task;
  onClose: () => void;
}

/**
 * This component renders searched-task section
 * @param {SearchedTaskProps} props
 * @returns {ReactNode} The SearchedTask component
 */
const SearchedTask: FC<SearchedTaskProps> = ({
  task,
  onClose,
}: SearchedTaskProps): ReactNode => {
  const navigate = useNavigate();

  const onClick = (task: Task) => {
    onClose();
    navigate(`/projects/${task.projectId}/tasks/${task.id}`);
  };

  return (
    <Card
      onClick={() => onClick(task)}
      size="small"
      hoverable
      key={task.id}
      className="search-task"
    >
      <Flex align="center" justify="space-between">
        <p className="text-primary-dark no-margin">
          {task.projectAlias}-{task.sequence}
        </p>
        <p className="no-margin">{truncateText(task.title, 35)}</p>

        <Flex align="center" gap={6}>
          <Avatar.Group
            size={22}
            max={{
              count: 2,
            }}
          >
            {task.assignees.map((assignee) => (
              <AvatarPic size={22} user={assignee} key={assignee.id} />
            ))}
          </Avatar.Group>
          <Tag>{task.status.title}</Tag>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SearchedTask;
