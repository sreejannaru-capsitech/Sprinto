import { Space, Typography } from "antd";
import type { FC, ReactNode } from "react";

import "~/styles/items.css";

interface TaskContainerProps {
  children: ReactNode;
  text: string;
}

/**
 * This component renders task-container section
 * @param {TaskContainerProps} props
 * @returns {ReactNode} The TaskContainer component
 */
const TaskContainer: FC<TaskContainerProps> = ({
  children,
  text,
}: TaskContainerProps): ReactNode => {
  return (
    <div>
      <Typography.Title
        level={4}
        className="font-bold"
        style={{ marginLeft: 10 }}
      >
        {text}
      </Typography.Title>
      <Space direction="vertical" size={16} className="task-container">
        {children}
      </Space>
    </div>
  );
};

export default TaskContainer;
