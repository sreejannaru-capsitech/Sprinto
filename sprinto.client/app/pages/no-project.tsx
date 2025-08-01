import type { ReactNode } from "react";
import CenteredLayout from "~/layouts/centered-layout";
import { AlertIcon } from "~/lib/icons";

/**
 * This component renders no-project section
 * @returns {ReactNode} The NoProject component
 */
const NoProject = (): ReactNode => {
  return (
    <CenteredLayout>
      <div style={{ textAlign: "center" }}>
        <AlertIcon size={64} />
        <p
          className="font-bold text-primary-dark"
          style={{
            fontSize: "1.4rem",
            marginBlockStart: "1rem",
            marginBlockEnd: "0.6rem",
          }}
        >
          You are not assigned to any project
        </p>
        <p
          className="text-primary-dark"
          style={{
            fontSize: "1rem",
            marginBlockStart: "0.2rem",
          }}
        >
          Contact you Team Lead or Admin
        </p>
      </div>
    </CenteredLayout>
  );
};

export default NoProject;
