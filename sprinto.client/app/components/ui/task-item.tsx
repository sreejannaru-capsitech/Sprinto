import { Avatar, Card, Col, Flex, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import {
  useMemo,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from "react";
import { CalenderIcon, HighIcon, LowIcon, MediumIcon } from "~/lib/icons";
import { getInitials, truncateText } from "~/lib/utils";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

import "~/styles/items.css";
import ToolTip from "./tooltip";

interface TaskItemProps {
  task: Task;
  isToday?: boolean;
  setTask: Dispatch<SetStateAction<Task | undefined>>;
}

/**
 * This component renders task-item component
 * @param {TaskItemProps} props
 * @returns {ReactNode} The TaskItem component
 */
const TaskItem: FC<TaskItemProps> = ({
  task,
  isToday = false,
  setTask,
}: TaskItemProps): ReactNode => {
  const dueDate = useMemo(() => {
    if (dayjs.utc(task.dueDate).isSame(dayjs.utc(), "day")) {
      return "Today";
    }
    return dayjs.utc(task.dueDate).format("Do MMMM");
  }, [task.dueDate]);

  return (
    <Card
      hoverable
      size="small"
      className="task-item"
      onClick={() => setTask(task)}
    >
      <Flex align="center" justify="space-between" className="task-item-header">
        <Typography.Text className="text-primary font-bolder smaller-text">
          {task.projectAlias}-{task.sequence}
        </Typography.Text>

        <Flex align="center">
          {task.assignees.map((assignee) => (
            <Avatar key={assignee.id} size={18}>
              <ToolTip title={assignee.name}>
                <span className="small-text">{getInitials(assignee.name)}</span>
              </ToolTip>
            </Avatar>
          ))}
        </Flex>
      </Flex>
      <Row gutter={0}>
        <Col span={2}>
          <ToolTip
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
          </ToolTip>
        </Col>
        <Col span={21}>
          <Typography.Text className="font-bold">{task.title}</Typography.Text>
          <Typography.Paragraph className="text-primary">
            {task.description ? truncateText(task.description, 35) : ""}
          </Typography.Paragraph>
          <Flex align="center" gap={4}>
            <Tag>{task.status.title}</Tag>

            {!isToday && (
              <Tag style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalenderIcon size={16} />
                <span>{dueDate}</span>
              </Tag>
            )}
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

export default TaskItem;
