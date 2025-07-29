import { Col, Row } from "antd";
import { useMemo, type ReactNode } from "react";
import CreateTask from "~/components/create-task";
import Spinner from "~/components/ui/spinner";
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
              className="text-primary-dark"
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBlockStart: "0.5rem",
              }}
            >
              You don't have any task today
            </p>
            <CreateTask block />
          </div>
        </CenteredLayout>
      ) : (
        <Row>
          <Col span={8}>
            <h2>Overdue</h2>
          </Col>
          <Col span={8}>
            <h2>Today</h2>
          </Col>
        </Row>
      )}
    </Spinner>
  );
};

export default TodayPageComponent;
