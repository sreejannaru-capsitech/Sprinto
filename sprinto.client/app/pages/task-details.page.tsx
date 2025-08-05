import { Avatar, Button, Col, Flex, Input, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useMemo, useState, type FC, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import TimeLineSection from "~/components/timeline-section";
import ToolTip from "~/components/ui/tooltip";
import { CalenderIcon, PencilIcon } from "~/lib/icons";
import { useTaskActivitiesQuery } from "~/lib/server/services";
import { getInitials } from "~/lib/utils";

import "~/styles/project-overview.css";

interface TaskDetailsPageProps {
  task: Task;
}

/**
 * This component renders task-details.page section
 * @param {TaskDetailsPageProps} props
 * @returns {ReactNode} The TaskDetailsPage component
 */
const TaskDetailsPage: FC<TaskDetailsPageProps> = ({
  task,
}: TaskDetailsPageProps): ReactNode => {
  const { data: _act, isPending: _actPending } = useTaskActivitiesQuery(
    task.id
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const dueDate = useMemo(() => {
    if (dayjs.utc(task.dueDate).isSame(dayjs.utc(), "day")) {
      return "Today";
    }
    return dayjs.utc(task.dueDate).format("Do MMMM");
  }, [task.dueDate]);

  // Manually converting the activities to the TaskActivity type
  const activities: TaskActivity[] = useMemo(() => {
    if (!_act?.result || _actPending) return [];
    return _act.result.map((a) => ({
      sequence: task.sequence,
      projectAlias: task.projectAlias,
      taskId: task.id,
      projectId: task.projectId,
      activity: a,
    }));
  }, [_act, _actPending]);

  return (
    <Row gutter={50} wrap={false}>
      <Col flex={"auto"}>
        <Flex align="center" justify="space-between">
          {/* Title and Timing */}
          <Flex align="center" gap={20}>
            <Typography.Title level={2}>
              <span className="text-primary-dark">{task.projectAlias}</span>
              <span className="text-primary-dark"> — </span>
              {task.sequence}
            </Typography.Title>

            <Flex gap={4} align="center" justify="center">
              <Tag
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CalenderIcon size={16} />
                <span>{dueDate}</span>
              </Tag>
              <Tag className="capitalize">Priority — {task.priority}</Tag>
              <Tag className="capitalize">Status — {task.status.title}</Tag>
            </Flex>
          </Flex>

          {/* Task Assignees & Edit Button */}
          <Flex align="center" gap={20}>
            <Button onClick={() => setModalOpen(true)}>
              <PencilIcon size={20} />
              <span>Edit</span>
            </Button>
            <TaskForm
              onClose={() => setModalOpen(false)}
              open={modalOpen}
              task={task}
            />
            <Flex align="center" gap={4}>
              <Avatar.Group
                max={{
                  count: 4,
                  style: { color: "black", backgroundColor: "white" },
                }}
              >
                {task.assignees.map((assignee) => (
                  <Avatar key={assignee.id}>
                    <ToolTip title={assignee.name}>
                      <span className="small-text">
                        {getInitials(assignee.name)}
                      </span>
                    </ToolTip>
                  </Avatar>
                ))}
              </Avatar.Group>
            </Flex>
          </Flex>
        </Flex>

        <Typography.Title level={4} className="font-bold">
          {task.title}
        </Typography.Title>

        <div className="task-description">
          <Typography.Paragraph>{task.description}</Typography.Paragraph>
        </div>

        <Typography.Title level={4} className="font-bold">
          Comments
        </Typography.Title>

        <Input />
      </Col>

      {/* Timeline Section */}
      <TimeLineSection activities={activities} />
    </Row>
  );
};

export default TaskDetailsPage;
