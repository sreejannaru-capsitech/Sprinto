import { Button } from "antd";
import { useMemo, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, type MetaArgs } from "react-router";
import Spinner from "~/components/ui/spinner";
import CenteredLayout from "~/layouts/centered-layout";
import { AlertIcon } from "~/lib/icons";
import { useProjectTasksQuery } from "~/lib/server/services";
import type { AppDispatch, RootState } from "~/lib/store/store";
import { setTask } from "~/lib/store/taskSlice";
import { isValidMongoId } from "~/lib/utils";
import TaskDetailsPage from "~/pages/task-details.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Task Details — Sprinto" },
    { name: "description", content: "Task details page" },
  ];
};

/**
 * This component renders task-details section
 * @returns {ReactNode} The TaskDetails component
 */
const TaskDetails = (): ReactNode => {
  const { taskId } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const proj = useSelector((state: RootState) => state.project.project);

  const { data, isPending } = useProjectTasksQuery(proj!.id);

  const taskItem = useMemo(() => {
    if (!isValidMongoId(taskId)) return undefined;
    var _task = data?.result?.find((t) => t.id === taskId);
    if (_task) dispatch(setTask(_task));
    return _task;
  }, [data?.result, taskId, proj]);

  return (
    <Spinner isActive={isPending}>
      {taskItem ? (
        <TaskDetailsPage task={taskItem} />
      ) : (
        <CenteredLayout>
          <div style={{ textAlign: "center" }}>
            <AlertIcon size={44} />
            <p
              className="text-primary-dark font-bold"
              style={{
                fontSize: "1rem",
                marginBlockStart: "0.5rem",
              }}
            >
              The task does not exist
            </p>
            <NavLink to="/inbox">
              <Button>Goto Inbox</Button>
            </NavLink>
          </div>
        </CenteredLayout>
      )}
    </Spinner>
  );
};

export default TaskDetails;
