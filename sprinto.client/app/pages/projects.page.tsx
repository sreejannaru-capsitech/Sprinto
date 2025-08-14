import { Flex } from "antd";
import { type ReactNode } from "react";
import ProjectsContainer from "~/components/projects-container";
import NoData from "~/components/ui/no-data";
import ProjectItem from "~/components/ui/project-item";
import Spinner from "~/components/ui/spinner";
import { useProjectsQuery } from "~/lib/server/services";

/**
 * This component renders projects.page section
 * @returns {ReactNode} The ProjectsPageComponent component
 */
const ProjectsPageComponent = (): ReactNode => {
  const { data: active, isPending: activePending } = useProjectsQuery();
  const { data: inactive, isPending: inactivePending } =
    useProjectsQuery(false);

  return (
    <Spinner isActive={activePending || inactivePending}>
      {!active?.result?.length && !inactive?.result?.length ? (
        <NoData text="You are not assigned to any project" isProject />
      ) : (
        <Flex style={{ marginTop: "2rem" }} wrap gap={30}>
          {active?.result?.length ? (
            <ProjectsContainer text="Active Projects">
              {active?.result.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </ProjectsContainer>
          ) : null}
          {inactive?.result?.length ? (
            <ProjectsContainer text="Inactive Projects">
              {inactive?.result?.map((project) => (
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
