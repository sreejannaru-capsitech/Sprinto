import { Flex } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import NoData from "~/components/ui/no-data";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import TaskItem from "~/components/ui/task-item";
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
        <NoData text="You don't have any task assigned" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={50}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />

          <TaskContainer text="High Priority">
            {highTasks.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setEditingTask} />
            ))}
          </TaskContainer>

          <TaskContainer text="Medium Priority">
            {mediumTasks.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setEditingTask} />
            ))}
          </TaskContainer>

          <TaskContainer text="Low Priority">
            {lowTasks.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setEditingTask} />
            ))}
          </TaskContainer>
        </Flex>
      )}
    </Spinner>
  );
};

export default InboxPageComponent;
