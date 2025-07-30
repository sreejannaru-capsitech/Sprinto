import type { FC, ReactNode } from "react";
import CenteredLayout from "~/layouts/centered-layout";
import { TaskIcon } from "~/lib/icons";
import CreateTask from "../create-task";

interface NoTaskProps {
  text: string;
}

/**
 * This component renders no-task section
 * @param {NoTaskProps} props
 * @returns {ReactNode} The NoTask component
 */
const NoTask: FC<NoTaskProps> = ({ text }: NoTaskProps): ReactNode => {
  return (
    <CenteredLayout>
      <div style={{ textAlign: "center" }}>
        <TaskIcon size={44} />
        <p
          className="text-primary-dark font-bold"
          style={{
            fontSize: "1rem",
            marginBlockStart: "0.5rem",
          }}
        >
          {text}
        </p>
        <CreateTask block />
      </div>
    </CenteredLayout>
  );
};

export default NoTask;
