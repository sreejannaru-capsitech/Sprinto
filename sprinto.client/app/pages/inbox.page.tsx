import { Flex } from "antd";
import { type ReactNode } from "react";
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

  const { high, medium, low } = data?.result ?? {};

  return (
    <Spinner isActive={isPending}>
      {!high?.length && !medium?.length && !low?.length ? (
        <NoData text="You don't have any task assigned" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={30}>
          <TaskContainer text="High Priority" tasks={high} />
          <TaskContainer text="Medium Priority" tasks={medium} />
          <TaskContainer text="Low Priority" tasks={low} />
        </Flex>
      )}
    </Spinner>
  );
};

export default InboxPageComponent;
