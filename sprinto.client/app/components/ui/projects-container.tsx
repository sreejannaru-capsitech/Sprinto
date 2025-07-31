import { Space, Typography } from "antd";
import type { FC, ReactNode } from "react";

import "~/styles/items.css";

interface TaskContainerProps {
  children: ReactNode;
  text: string;
  horizontal?: boolean;
}

/**
 * This component renders task-container section
 * @param {TaskContainerProps} props
 * @returns {ReactNode} The ProjectsContainer component
 */
const ProjectsContainer: FC<TaskContainerProps> = ({
  children,
  text,
  horizontal = false,
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
      <Space
        direction={horizontal ? "horizontal" : "vertical"}
        size={16}
        className="project-container"
      >
        {children}
      </Space>
    </div>
  );
};

export default ProjectsContainer;
