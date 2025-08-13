import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import TaskStatusForm from "~/components/forms/status-form";
import { TaskIcon } from "~/lib/icons";
import AdminTasksPage from "~/pages/admin/admin-tasks.page";

export function meta({}: MetaArgs) {
  return [
    { title: "Sprinto — Tasks Statistics" },
    { name: "description", content: "View tasks statistics with Sprinto" },
  ];
}

/**
 * This component renders tasks section
 * @returns {ReactNode} The TasksPage component
 */
const TasksPage = (): ReactNode => {
  return (
    <>
      <Flex align="center" justify="space-between" style={{ width: 240 }}>
        <Flex align="center" gap={6}>
          <TaskIcon size={36} />
          <Typography.Title
            level={2}
            className="text-primary-dark"
            style={{ margin: 0 }}
          >
            Tasks
          </Typography.Title>
        </Flex>
        <TaskStatusForm />
      </Flex>

      <AdminTasksPage />
    </>
  );
};

export default TasksPage;
