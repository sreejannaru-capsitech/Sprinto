import { Flex } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import NoData from "~/components/ui/no-data";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import { useTodayTaskQuery } from "~/lib/server/services";

/**
 * This component renders today.page section
 * @returns {ReactNode} The TodayPage component
 */
const TodayPageComponent = (): ReactNode => {
  const { data, isPending } = useTodayTaskQuery();

  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const { overdue, today } = useMemo(() => {
    return {
      overdue: data?.result?.overdue ?? [],
      today: data?.result?.today ?? [],
    };
  }, [data]);

  return (
    <Spinner isActive={isPending}>
      {overdue.length === 0 && today.length === 0 ? (
        <NoData text="You don't have any task today" />
      ) : (
        <Flex style={{ marginTop: "1rem" }} gap={30}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />

          <TaskContainer
            text="Overdue"
            tasks={overdue}
            setTask={setEditingTask}
          />
          <TaskContainer text="Today" tasks={today} setTask={setEditingTask} />
        </Flex>
      )}
    </Spinner>
  );
};

export default TodayPageComponent;
