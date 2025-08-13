import { type ReactNode } from "react";
import { type MetaArgs } from "react-router";
import CreateTask from "~/components/create-task";
import PageTitle from "~/components/page-title";
import { TaskIcon } from "~/lib/icons";
import ProjectTasksPage from "~/pages/project-tasks.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Tasks — Sprinto" },
    { name: "description", content: "View and manage tasks for your project" },
  ];
};

/**
 * This component renders project-tasks section
 * @returns {ReactNode} The ProjectTasks component
 */
const ProjectTasks = (): ReactNode => {
  return (
    <>
      <PageTitle title="Tasks" icon={<TaskIcon size={36} />} width={170}>
        <CreateTask plusIcon />
      </PageTitle>
      <ProjectTasksPage />
    </>
  );
};

export default ProjectTasks;
