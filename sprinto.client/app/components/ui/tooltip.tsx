import { Tooltip } from "antd";
import type { FC, ReactNode } from "react";

interface ToolTipProps {
  children: ReactNode;
  title: string;
}

/**
 * This component renders tooltip section
 * @param {ToolTipProps} props
 * @returns {ReactNode} The ToolTip component
 */
const ToolTip: FC<ToolTipProps> = ({
  children,
  title,
}: ToolTipProps): ReactNode => {
  return (
    <Tooltip
      title={title}
      color="var(--solid-gray)"
      placement="top"
      arrow={false}
    >
      {children}
    </Tooltip>
  );
};

export default ToolTip;
