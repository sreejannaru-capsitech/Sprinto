import { Col, Flex, Row, Space, Typography } from "antd";
import { useMemo, type ReactNode } from "react";
import CreateTask from "~/components/create-task";
import Spinner from "~/components/ui/spinner";
import TaskItem from "~/components/ui/task-item";
import CenteredLayout from "~/layouts/centered-layout";
import { TaskIcon } from "~/lib/icons";
import { useTodayTaskQuery } from "~/lib/server/services";

/**
 * This component renders today.page section
 * @returns {ReactNode} The TodayPage component
 */
const TodayPageComponent = (): ReactNode => {
  const { data, isPending } = useTodayTaskQuery();

  const isEmpty = useMemo(() => {
    return (
      data?.result?.today.length === 0 && data?.result?.overdue.length === 0
    );
  }, [data]);

  return (
    <Spinner isActive={isPending}>
      {isEmpty ? (
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
              You don't have any task today
            </p>
            <CreateTask block />
          </div>
        </CenteredLayout>
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={32}>
          {/* Don't show overdue tasks section if there are none */}
          {data?.result?.overdue.length ? (
            <div>
              <Typography.Title level={4} className="font-bold">
                Overdue
              </Typography.Title>
              <Space direction="vertical" size={16}>
                {data?.result?.overdue.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </Space>
            </div>
          ) : null}
          <div>
            <Typography.Title level={4} className="font-bold">
              Today
            </Typography.Title>
            <Space direction="vertical" size={16}>
              {data?.result?.today.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Space>
          </div>
        </Flex>
      )}
    </Spinner>
  );
};

export default TodayPageComponent;
