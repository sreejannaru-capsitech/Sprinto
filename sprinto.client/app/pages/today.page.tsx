import { Flex } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import NoData from "~/components/ui/no-data";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
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
        <NoData text="You don't have any task today" />
      ) : (
        <Flex style={{ marginTop: "1rem" }} gap={50}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />
          {/* Don't show overdue tasks section if there are none */}
          {data?.result?.overdue.length ? (
            <TaskContainer text="Overdue">
              {data?.result?.overdue.map((task) => (
                <TaskItem key={task.id} task={task} setTask={setEditingTask} />
              ))}
            </TaskContainer>
          ) : null}
          {data?.result?.today.length ? (
            <TaskContainer text="Today">
              {data?.result?.today.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isToday
                  setTask={setEditingTask}
                />
              ))}
            </TaskContainer>
          ) : null}
        </Flex>
      )}
    </Spinner>
  );
};

export default TodayPageComponent;
