import { Flex, Space, Typography } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import NoTask from "~/components/ui/no-task";
import Spinner from "~/components/ui/spinner";
import TaskItem from "~/components/ui/task-item";
import { useTodayTaskQuery } from "~/lib/server/services";

/**
 * This component renders today.page section
 * @returns {ReactNode} The TodayPage component
 */
const TodayPageComponent = (): ReactNode => {
  const { data, isPending } = useTodayTaskQuery();

  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const isEmpty = useMemo(() => {
    return (
      data?.result?.today.length === 0 && data?.result?.overdue.length === 0
    );
  }, [data]);

  return (
    <Spinner isActive={isPending}>
      {isEmpty ? (
        <NoTask text="You don't have any task today" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={32}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />
          {/* Don't show overdue tasks section if there are none */}
          {data?.result?.overdue.length ? (
            <div>
              <Typography.Title level={4} className="font-bold">
                Overdue
              </Typography.Title>
              <Space direction="vertical" size={16}>
                {data?.result?.overdue.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    setTask={setEditingTask}
                  />
                ))}
              </Space>
            </div>
          ) : null}
          {data?.result?.today.length ? (
            <div>
              <Typography.Title level={4} className="font-bold">
                Today
              </Typography.Title>
              <Space direction="vertical" size={16}>
                {data?.result?.today.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isToday
                    setTask={setEditingTask}
                  />
                ))}
              </Space>
            </div>
          ) : null}
        </Flex>
      )}
    </Spinner>
  );
};

export default TodayPageComponent;
