import { Spin } from "antd";
import type { FC, ReactNode } from "react";
import CenteredLayout from "~/layouts/centered-layout";
import { LoaderIcon } from "~/lib/icons";

interface SpinnerProps {
  isActive?: boolean;
  fullscreen?: boolean;
  children: ReactNode;
}

/**
 * This component renders spinner section
 * @param {SpinnerProps} props
 * @returns {ReactNode} The Spinner component
 */
const Spinner: FC<SpinnerProps> = ({
  isActive = false,
  fullscreen = false,
  children,
}: SpinnerProps): ReactNode => {
  return isActive ? (
    <CenteredLayout>
      <Spin indicator={<LoaderIcon size={30} />} fullscreen={fullscreen} />
    </CenteredLayout>
  ) : (
    <>{children}</>
  );
};

export default Spinner;
