import { Flex, Row } from "antd";
import dayjs from "dayjs";
import { useMemo, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import TaskForm from "~/components/forms/task-form";
import NoData from "~/components/ui/no-data";
import ProjectItem from "~/components/ui/project-item";
import ProjectsContainer from "~/components/ui/projects-container";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import { useProjectsQuery, useUpcomingTasksQuery } from "~/lib/server/services";
import type { RootState } from "~/lib/store/store";

/**
 * This component renders inbox.page section
 * @returns {ReactNode} The UpcomingPageComponent component
 */
const UpcomingPageComponent = (): ReactNode => {
  const { data, isPending } = useUpcomingTasksQuery();
  const { data: projects } = useProjectsQuery();
  const user = useSelector((state: RootState) => state.user.user);

  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const upcomingProjects = useMemo(() => {
    if (!data?.result?.length || !projects?.result?.length) {
      return [];
    }

    const filtered = projects.result.filter((project) => !!project.deadline);

    return filtered.sort((a, b) => {
      const aTime = dayjs(a.deadline).valueOf();
      const bTime = dayjs(b.deadline).valueOf();
      return aTime - bTime;
    });
  }, [data, projects]);

  return (
    <Spinner isActive={isPending}>
      {user?.role !== "employee" ? (
        <Row style={{ marginTop: "1rem" }}>
          {upcomingProjects.length ? (
            <ProjectsContainer text="Upcoming Project Deadlines" horizontal>
              {upcomingProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </ProjectsContainer>
          ) : null}
        </Row>
      ) : null}
      <Row>
        {!data?.result?.length ? (
          <NoData text="You don't have any upcoming task" />
        ) : (
          <Flex
            style={{ marginTop: `${user?.role !== "employee" ? 1 : 2}rem` }}
            gap={30}
          >
            <TaskForm
              onClose={() => setEditingTask(undefined)}
              open={!!editingTask}
              task={editingTask}
            />

            {data.result.map((group) => (
              <TaskContainer
                height={user?.role !== "employee" ? 410 : undefined}
                text={group.projectTitle}
                tasks={group.tasks}
                setTask={setEditingTask}
                key={group.projectId}
              />
            ))}
          </Flex>
        )}
      </Row>
    </Spinner>
  );
};

export default UpcomingPageComponent;
