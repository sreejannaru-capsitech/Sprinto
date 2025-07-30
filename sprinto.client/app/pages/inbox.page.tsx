import { Flex, Space, Typography } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import CreateTask from "~/components/create-task";
import TaskForm from "~/components/forms/task-form";
import Spinner from "~/components/ui/spinner";
import TaskItem from "~/components/ui/task-item";
import CenteredLayout from "~/layouts/centered-layout";
import { TaskIcon } from "~/lib/icons";
import { useInboxTasksQuery } from "~/lib/server/services";

/**
 * This component renders inbox.page section
 * @returns {ReactNode} The InboxPageComponent component
 */
const InboxPageComponent = (): ReactNode => {
  const { data, isPending } = useInboxTasksQuery();
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const lowTasks = useMemo(() => {
    return data?.result?.filter((task) => task.priority === "low") ?? [];
  }, [data]);

  const mediumTasks = useMemo(() => {
    return data?.result?.filter((task) => task.priority === "medium") ?? [];
  }, [data]);

  const highTasks = useMemo(() => {
    return data?.result?.filter((task) => task.priority === "high") ?? [];
  }, [data]);

  return (
    <Spinner isActive={isPending}>
      {!data?.result?.length ? (
        <CenteredLayout>
          <div style={{ textAlign: "center" }}>
            <TaskIcon size={44} />
            <p
              className="text-primary-dark font-bold"
              style={{
                fontSize: "1rem",
                marginBlockStart: "0.5rem",
              }}
            >
              You don't have any task assigned
            </p>
            <CreateTask block />
          </div>
        </CenteredLayout>
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={50}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />

          <div>
            <Typography.Title level={4} className="font-bold">
              High Priority
            </Typography.Title>
            <Space direction="vertical" size={16}>
              {highTasks.map((task) => (
                <TaskItem key={task.id} task={task} setTask={setEditingTask} />
              ))}
            </Space>
          </div>

          <div>
            <Typography.Title level={4} className="font-bold">
              Medium Priority
            </Typography.Title>
            <Space direction="vertical" size={16}>
              {mediumTasks.map((task) => (
                <TaskItem key={task.id} task={task} setTask={setEditingTask} />
              ))}
            </Space>
          </div>

          <div>
            <Typography.Title level={4} className="font-bold">
              Low Priority
            </Typography.Title>
            <Space direction="vertical" size={16}>
              {lowTasks.map((task) => (
                <TaskItem key={task.id} task={task} setTask={setEditingTask} />
              ))}
            </Space>
          </div>
        </Flex>
      )}
    </Spinner>
  );
};

export default InboxPageComponent;
