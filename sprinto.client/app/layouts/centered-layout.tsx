import type { FC, ReactNode } from "react";

interface CenteredLayoutProps {
  children: ReactNode;
}

/**
 * This component renders centered-layout section
 * @returns {ReactNode} The CenteredLayout component
 */
const CenteredLayout: FC<CenteredLayoutProps> = ({
  children,
}: CenteredLayoutProps): ReactNode => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ marginTop: "-80px" }}>{children}</div>
    </div>
  );
};

export default CenteredLayout;
