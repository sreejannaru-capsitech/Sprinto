import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import TaskStatusForm from "~/components/forms/status-form";
import PageTitle from "~/components/page-title";
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
      <PageTitle title="Tasks" icon={<TaskIcon size={36} />} width={240}>
        <TaskStatusForm />
      </PageTitle>
      <AdminTasksPage />
    </>
  );
};

export default TasksPage;
