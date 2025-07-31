import { Flex, Space, Typography } from "antd";
import { useMemo, type ReactNode } from "react";
import NoData from "~/components/ui/no-data";
import ProjectItem from "~/components/ui/project-item";
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
        <Flex style={{ marginTop: "4rem" }} wrap gap={40}>
          {active.length ? (
            <div>
              <Typography.Title level={4} className="font-bold">
                Active Projects
              </Typography.Title>
              <Space direction="vertical" size={16}>
                {active.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </Space>
            </div>
          ) : null}
          {inActive.length ? (
            <div>
              <Typography.Title level={4} className="font-bold">
                Inactive Projects
              </Typography.Title>
              <Space direction="vertical" size={16}>
                {inActive.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </Space>
            </div>
          ) : null}
        </Flex>
      )}
    </Spinner>
  );
};

export default ProjectsPageComponent;
