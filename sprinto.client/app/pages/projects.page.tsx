import { Flex } from "antd";
import { useMemo, type ReactNode } from "react";
import NoData from "~/components/ui/no-data";
import ProjectItem from "~/components/ui/project-item";
import ProjectsContainer from "~/components/ui/projects-container";
import Spinner from "~/components/ui/spinner";
import { useAssignedProjectsQuery } from "~/lib/server/services";

/**
 * This component renders projects.page section
 * @returns {ReactNode} The ProjectsPageComponent component
 */
const ProjectsPageComponent = (): ReactNode => {
  const { data, isPending } = useAssignedProjectsQuery();

  const [active, inActive] = useMemo(() => {
    if (!data?.result?.length) {
      return [[], []];
    }

    var active = data.result.filter((project) => !project.isCompleted);
    var inActive = data.result.filter((project) => project.isCompleted);

    return [active, inActive];
  }, [data]);

  return (
    <Spinner isActive={isPending}>
      {!data?.result?.length ? (
        <NoData text="You are not assigned to any project" isProject />
      ) : (
        <Flex style={{ marginTop: "2rem" }} wrap gap={50}>
          {active.length ? (
            <ProjectsContainer text="Active Projects">
              {active.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </ProjectsContainer>
          ) : null}
          {inActive.length ? (
            <ProjectsContainer text="Inactive Projects">
              {inActive.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </ProjectsContainer>
          ) : null}
        </Flex>
      )}
    </Spinner>
  );
};

export default ProjectsPageComponent;
