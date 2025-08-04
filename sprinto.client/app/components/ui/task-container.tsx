import { Space, Typography } from "antd";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";

import "~/styles/items.css";
import TaskItem from "./task-item";

interface TaskContainerProps {
  tasks: Task[] | undefined;
  setTask: Dispatch<SetStateAction<Task | undefined>>;
  text: string;
  height?: number;
}

/**
 * This component renders task-container section
 * @param {TaskContainerProps} props
 * @returns {ReactNode} The TaskContainer component
 */
const TaskContainer: FC<TaskContainerProps> = ({
  tasks,
  setTask,
  text,
  height = 680,
}: TaskContainerProps): ReactNode => {
  return (
    <>
      {tasks !== undefined && tasks.length > 0 ? (
        <div>
          <Typography.Title
            level={4}
            className="font-bold"
            style={{ marginLeft: 10 }}
          >
            {text}
          </Typography.Title>
          <Space
            direction="vertical"
            size={16}
            style={{ maxHeight: `${height}px` }}
            className="task-container"
          >
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} setTask={setTask} />
            ))}
          </Space>
        </div>
      ) : null}
    </>
  );
};

export default TaskContainer;
