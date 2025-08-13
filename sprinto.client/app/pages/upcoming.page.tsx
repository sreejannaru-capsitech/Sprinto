import { Flex, Row } from "antd";
import dayjs from "dayjs";
import { useMemo, type ReactNode } from "react";
import { useSelector } from "react-redux";
import NoData from "~/components/ui/no-data";
import ProjectItem from "~/components/ui/project-item";
import ProjectsContainer from "~/components/ui/projects-container";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import { USER_EMPLOYEE } from "~/lib/const";
import { useProjectsQuery, useUpcomingTasksQuery } from "~/lib/server/services";
import type { RootState } from "~/lib/store";

/**
 * This component renders inbox.page section
 * @returns {ReactNode} The UpcomingPageComponent component
 */
const UpcomingPageComponent = (): ReactNode => {
  const { data, isPending } = useUpcomingTasksQuery();
  const { data: projects } = useProjectsQuery();
  const user = useSelector((state: RootState) => state.user.user);

  const upcomingProjects = useMemo(() => {
    if (!data?.result?.length || !projects?.result?.length) {
      return [];
    }

    const filtered = projects.result.filter((project) => !!project.deadline);

    return filtered
      .sort((a, b) => dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf())
      .slice(0, 3); // keep only the first 3 projects
  }, [data, projects]);

  return (
    <Spinner isActive={isPending}>
      {user?.role !== USER_EMPLOYEE ? (
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
      {!data?.result?.length ? (
        <NoData text="You don't have any upcoming task" />
      ) : (
        <Row>
          <Flex
            style={{ marginTop: `${user?.role !== USER_EMPLOYEE ? 1 : 2}rem` }}
            gap={30}
          >
            {data.result.map((group) => (
              <TaskContainer
                height={user?.role !== USER_EMPLOYEE ? 410 : undefined}
                text={group.projectTitle}
                tasks={group.tasks}
                key={group.projectId}
              />
            ))}
          </Flex>
        </Row>
      )}
    </Spinner>
  );
};

export default UpcomingPageComponent;
