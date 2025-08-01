import { Flex } from "antd";
import { useState, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import NoData from "~/components/ui/no-data";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import { useInboxTasksQuery } from "~/lib/server/services";

/**
 * This component renders inbox.page section
 * @returns {ReactNode} The InboxPageComponent component
 */
const InboxPageComponent = (): ReactNode => {
  const { data, isPending } = useInboxTasksQuery();
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const { high, medium, low } = data?.result ?? {};

  return (
    <Spinner isActive={isPending}>
      {!high?.length && !medium?.length && !low?.length ? (
        <NoData text="You don't have any task assigned" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={30}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />

          <TaskContainer
            text="High Priority"
            tasks={high}
            setTask={setEditingTask}
          />
          <TaskContainer
            text="Medium Priority"
            tasks={medium}
            setTask={setEditingTask}
          />
          <TaskContainer
            text="Low Priority"
            tasks={low}
            setTask={setEditingTask}
          />
        </Flex>
      )}
    </Spinner>
  );
};

export default InboxPageComponent;
