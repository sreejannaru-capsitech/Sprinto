import { Flex, Typography } from "antd";
import dayjs from "dayjs";
import { useMemo, type ReactNode } from "react";
import type { MetaArgs } from "react-router";
import ProjectItem from "~/components/ui/project-item";
import ProjectsContainer from "~/components/projects-container";
import Spinner from "~/components/ui/spinner";
import TaskItem from "~/components/ui/task-item";
import { useProjectsQuery, useTopDueTasksQuery } from "~/lib/server/services";

import "~/styles/items.css";

export function meta({}: MetaArgs) {
  return [
    { title: "Sprinto — Deadlines" },
    { name: "description", content: "Manage deadlines with Sprinto" },
  ];
}

/**
 * This component renders deadline section
 * @returns {ReactNode} The Deadlines component
 */
const Deadlines = (): ReactNode => {
  const { data: projects, isPending: projPending } = useProjectsQuery();
  const { data: topDueTasks, isPending: taskPending } = useTopDueTasksQuery();

  const dueProjects = useMemo(() => {
    if (!projects?.result?.length) {
      return [];
    }
    const due = projects.result.filter(
      (project) => project.deadline && project.isCompleted === false
    );

    return due.sort((a, b) => {
      const aTime = dayjs(a.deadline).valueOf();
      const bTime = dayjs(b.deadline).valueOf();
      return aTime - bTime;
    });
  }, [projects]);

  return (
    <Flex gap={80}>
      <div>
        <Typography.Title level={4} className="font-bold container-header">
          Deadline Projects
        </Typography.Title>

        <Spinner isActive={projPending}>
          <ProjectsContainer text="">
            {dueProjects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </ProjectsContainer>
        </Spinner>
      </div>

      <div>
        <Typography.Title level={4} className="font-bold container-header">
          Due Soon Tasks
        </Typography.Title>

        {/* <TaskContainer text="" tasks={topDueTasks?.result ?? []} /> */}
        <Spinner isActive={taskPending}>
          <Flex
            align="flex-start"
            gap={20}
            wrap
            className="due-tasks-container"
          >
            {topDueTasks?.result?.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Flex>
        </Spinner>
      </div>
    </Flex>
  );
};

export default Deadlines;
