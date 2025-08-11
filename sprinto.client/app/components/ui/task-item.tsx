import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Popconfirm,
  Row,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { useMemo, type FC, type ReactNode } from "react";
import {
  AlertIcon,
  CalenderIcon,
  DeleteIcon,
  HighIcon,
  LowIcon,
  MediumIcon,
  TickRoundedIcon,
} from "~/lib/icons";
import { truncateText } from "~/lib/utils";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

import { NavLink } from "react-router";
import { useAntNotification } from "~/hooks";
import {
  useDeleteTask,
  useStatusesQuery,
  useUpdateTask,
} from "~/lib/server/services";
import "~/styles/items.css";
import AvatarPic from "./avatar-pic";
import CustomTooltip from "./tooltip";

interface TaskItemProps {
  task: Task;
  isToday?: boolean;
}

/**
 * This component renders task-item component
 * @param {TaskItemProps} props
 * @returns {ReactNode} The TaskItem component
 */
const TaskItem: FC<TaskItemProps> = ({
  task,
  isToday = false,
}: TaskItemProps): ReactNode => {
  const { data: statuses, isPending: statusesPending } = useStatusesQuery();

  const dueDate = useMemo(() => {
    if (dayjs.utc(task.dueDate).isSame(dayjs.utc(), "day")) {
      return "Today";
    }
    return dayjs.utc(task.dueDate).format("Do MMMM");
  }, [task.dueDate]);

  // Check if task is overdue and not done
  const isOverdue = useMemo(() => {
    return (
      dayjs.utc(task.dueDate).isBefore(dayjs.utc(), "day") &&
      task.status.title !== "Done"
    );
  }, [task.dueDate]);

  const { _api, contextHolder } = useAntNotification();

  const { mutateAsync: deleteTask } = useDeleteTask(_api);

  const { mutateAsync: updateTask } = useUpdateTask(_api);

  const handleDone = async () => {
    if (!statuses?.result) return;
    const done = statuses?.result.find((s) => s.title === "Done");
    if (!done) return;

    await updateTask({
      id: task.id,
      task: { ...task, status: done },
    });
  };

  return (
    <Card hoverable size="small" className="task-item">
      {contextHolder}
      <Flex align="center" justify="space-between" className="task-item-header">
        <NavLink
          to={`/projects/${task.projectId}/tasks/${task.id}`}
          style={{ display: "flex", alignItems: "center", flex: 1 }}
        >
          <Flex align="center" gap={10} flex={1}>
            <Typography.Text className="text-primary font-bolder smaller-text">
              {task.projectAlias}-{task.sequence}
            </Typography.Text>
            <Avatar.Group
              size={21}
              max={{
                count: 2,
                style: { color: "black", backgroundColor: "white" },
              }}
            >
              {task.assignees.map((assignee) => (
                <AvatarPic user={assignee} size={21} key={assignee.id} />
              ))}
            </Avatar.Group>
          </Flex>
        </NavLink>

        <Flex align="center">
          {task.status.title !== "Done" && (
            <Popconfirm
              title="Mark as Done ?"
              onConfirm={handleDone}
              icon={<AlertIcon size={18} />}
            >
              <Button
                disabled={statusesPending}
                type="text"
                className="task-delete-btn"
                icon={<TickRoundedIcon size={20} />}
              />
            </Popconfirm>
          )}
          <Popconfirm
            title="Delete this task ?"
            onConfirm={async () => await deleteTask(task.id)}
            icon={<AlertIcon size={18} />}
          >
            <Button
              type="text"
              className="task-delete-btn"
              icon={<DeleteIcon size={20} />}
            />
          </Popconfirm>
        </Flex>
      </Flex>
      <NavLink to={`/projects/${task.projectId}/tasks/${task.id}`}>
        <Row gutter={0}>
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
          <Col span={21}>
            <Typography.Text className="font-bold">
              {task.title}
            </Typography.Text>
            <Typography.Paragraph className="text-primary">
              {task.description ? (
                <CustomTooltip title={task.description}>
                  <span>{truncateText(task.description, 35)}</span>
                </CustomTooltip>
              ) : (
                ""
              )}
            </Typography.Paragraph>
            <Flex align="center" gap={4}>
              <Tag>
                <span
                  style={{
                    color: task.status.title === "Done" ? "green" : "",
                  }}
                >
                  {task.status.title}
                </span>
              </Tag>

              {!isToday && (
                <Tag
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderColor: isOverdue ? "" : "",
                  }}
                >
                  <CalenderIcon
                    fill={isOverdue ? "var(--color-red)" : "#141B34"}
                    size={16}
                  />
                  <span style={{ color: isOverdue ? "var(--color-red)" : "" }}>
                    {dueDate}
                  </span>
                </Tag>
              )}
            </Flex>
          </Col>
        </Row>
      </NavLink>
    </Card>
  );
};

export default TaskItem;
