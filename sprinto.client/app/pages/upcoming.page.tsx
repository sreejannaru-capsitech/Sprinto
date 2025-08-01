import { Flex } from "antd";
import { useState, type ReactNode } from "react";
import TaskForm from "~/components/forms/task-form";
import NoData from "~/components/ui/no-data";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import { useUpcomingTasksQuery } from "~/lib/server/services";

/**
 * This component renders inbox.page section
 * @returns {ReactNode} The UpcomingPageComponent component
 */
const UpcomingPageComponent = (): ReactNode => {
  const { data, isPending } = useUpcomingTasksQuery();
  // const { data: projects, isPending: projectsPending } =
  //   useProjectsQuery();

  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // const groupTasksByProject = (
  //   tasks: Task[],
  //   projects: Project[]
  // ): ProjectTaskGroup[] => {
  //   const map = new Map<string, { projectName: string; tasks: Task[] }>();

  //   for (const task of tasks) {
  //     const project = projects.find((p) => p.id === task.projectId);
  //     if (!project) continue;

  //     if (!map.has(task.projectId)) {
  //       map.set(task.projectId, { projectName: project.title, tasks: [] });
  //     }

  //     map.get(task.projectId)!.tasks.push(task);
  //   }

  //   return Array.from(map.entries()).map(([projectId, data]) => ({
  //     projectId,
  //     projectTitle: data.projectName,
  //     tasks: data.tasks,
  //   }));
  // };

  // const groupedTasks = useMemo(() => {
  //   if (!data?.result?.length) return [];

  //   const tasks = data?.result;

  //   if (!tasks || !projects) return [];

  //   return groupTasksByProject(tasks, projects?.result ?? []);
  // }, [data, projects]);

  return (
    <Spinner isActive={isPending}>
      {!data?.result?.length ? (
        <NoData text="You don't have any upcoming task" />
      ) : (
        <Flex style={{ marginTop: "2rem" }} gap={30}>
          <TaskForm
            onClose={() => setEditingTask(undefined)}
            open={!!editingTask}
            task={editingTask}
          />

          {data.result.map((group) => (
            <TaskContainer
              text={group.projectTitle}
              tasks={group.tasks}
              setTask={setEditingTask}
              key={group.projectId}
            />
          ))}
        </Flex>
      )}
    </Spinner>
  );
};

export default UpcomingPageComponent;
