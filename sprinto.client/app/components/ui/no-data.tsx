import type { FC, ReactNode } from "react";
import CenteredLayout from "~/layouts/centered-layout";
import { ProjectIcon, TaskIcon } from "~/lib/icons";
import CreateTask from "../create-task";

interface NoTaskProps {
  text: string;
  isProject?: boolean;
}

/**
 * This component renders no-task section
 * @param {NoTaskProps} props
 * @returns {ReactNode} The NoData component
 */
const NoData: FC<NoTaskProps> = ({
  text,
  isProject = false,
}: NoTaskProps): ReactNode => {
  return (
    <CenteredLayout>
      <div style={{ textAlign: "center" }}>
        {isProject ? <ProjectIcon size={44} /> : <TaskIcon size={44} />}
        <p
          className="text-primary-dark font-bold"
          style={{
            fontSize: "1rem",
            marginBlockStart: "0.5rem",
          }}
        >
          {text}
        </p>
        {!isProject && <CreateTask block />}
      </div>
    </CenteredLayout>
  );
};

export default NoData;
