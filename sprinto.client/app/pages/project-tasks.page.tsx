import { Flex } from "antd";
import { useMemo, type FC, type ReactNode } from "react";
import NoData from "~/components/ui/no-data";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import { useProjectTasksQuery } from "~/lib/server/services";

interface ProjectTasksProps {
  proj: Project;
}

interface TaskStatusGroup {
  status: string;
  tasks: Task[];
}

/**
 * This function groups tasks by status
 * @param {Task[]} tasks - The tasks to group
 * @returns {TaskStatusGroup[]} The grouped tasks
 */
const groupTasksByStatus = (tasks: Task[]): TaskStatusGroup[] => {
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.status.title;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {});

  return Object.entries(grouped).map(([status, tasks]) => ({
    status,
    tasks,
  }));
};

/**
 * This component renders project-tasks.page section
 * @param {ProjectTasksProps} props
 * @returns {ReactNode} The ProjectTasks component
 */
const ProjectTasksPage: FC<ProjectTasksProps> = ({
  proj,
}: ProjectTasksProps): ReactNode => {
  const { data, isPending } = useProjectTasksQuery(proj.id);

  const group = useMemo(() => {
    if (!data?.result) return [];
    return groupTasksByStatus(data.result);
  }, [data?.result]);

  return (
    <Spinner isActive={isPending}>
      {!data?.result?.length ? (
        <NoData text="Project does not have any task" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={30}>
          {group.map((g) => (
            <TaskContainer
              key={g.status}
              text={g.status}
              tasks={g.tasks}
              setTask={() => {}}
            />
          ))}
        </Flex>
      )}
    </Spinner>
  );
};

export default ProjectTasksPage;
