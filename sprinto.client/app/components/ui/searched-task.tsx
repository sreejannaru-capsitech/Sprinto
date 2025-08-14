import { Avatar, Card, Col, Flex, Row } from "antd";
import type { FC, ReactNode } from "react";
import { truncateText } from "~/lib/utils";
import AvatarPic from "./avatar-pic";

import { NavLink } from "react-router";
import "~/styles/items.css";
import CustomTag from "./custom-tag";
import CustomTooltip from "./tooltip";
import { HighIcon, LowIcon, MediumIcon } from "~/lib/icons";

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
  return (
    <NavLink to={`/projects/${task.projectId}/tasks/${task.id}`}>
      <Card size="small" hoverable key={task.id} className="search-task">
        <Row align="middle">
          <Col span={15}>
            <Flex align="center" gap={12}>
              <p className="text-primary-dark no-margin">
                {task.projectAlias}-{task.sequence}
              </p>
              <p className="no-margin">
                <CustomTooltip title={task.title}>
                  {truncateText(task.title, 30)}
                </CustomTooltip>
              </p>
            </Flex>
          </Col>

          <Col span={2}>
            <CustomTooltip
              title={
                task.priority.charAt(0).toUpperCase() +
                task.priority.slice(1) +
                " Priority"
              }
            >
              <span>
                {task.priority === "low" ? (
                  <LowIcon size={22} />
                ) : task.priority === "medium" ? (
                  <MediumIcon size={22} />
                ) : (
                  <HighIcon size={22} />
                )}
              </span>
            </CustomTooltip>
          </Col>

          <Col span={7}>
            <Flex align="center" justify="space-between">
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
              <CustomTag text={task.status.title} />
            </Flex>
          </Col>
        </Row>
      </Card>
    </NavLink>
  );
};

export default SearchedTask;
