import { Flex } from "antd";
import { useMemo, type ReactNode } from "react";
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

          <TaskContainer
            text="Overdue"
            tasks={overdue}
          />
          <TaskContainer text="Today" tasks={today} />
        </Flex>
      )}
    </Spinner>
  );
};

export default TodayPageComponent;
