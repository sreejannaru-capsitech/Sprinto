import { Flex } from "antd";
import { useState, type ReactNode } from "react";
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

  return (
    <Spinner isActive={isPending}>
      {!data?.result?.high.length ||
      !data?.result?.medium.length ||
      !data?.result?.low.length ? (
        <NoData text="You don't have any task assigned" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={50}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />

          <TaskContainer text="High Priority">
            {data?.result?.high.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setEditingTask} />
            ))}
          </TaskContainer>

          <TaskContainer text="Medium Priority">
            {data?.result?.medium.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setEditingTask} />
            ))}
          </TaskContainer>

          <TaskContainer text="Low Priority">
            {data?.result?.low.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setEditingTask} />
            ))}
          </TaskContainer>
        </Flex>
      )}
    </Spinner>
  );
};

export default InboxPageComponent;
