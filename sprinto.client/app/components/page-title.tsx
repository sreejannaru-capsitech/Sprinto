import { Flex, Typography } from "antd";
import type { FC, ReactNode } from "react";

interface PageTitleProps {
  title: string;
  icon: ReactNode;
  children?: ReactNode;
  width?: number;
}

/**
 * This component renders page-title section
 * @param {PageTitleProps} props
 * @returns {ReactNode} The PageTitle component
 */
const PageTitle: FC<PageTitleProps> = ({
  title,
  icon,
  children,
  width,
}: PageTitleProps): ReactNode => {
  return (
    <Flex align="center" justify="space-between" style={{ width: width }}>
      <Flex align="center" gap={6}>
        {icon}
        <Typography.Title
          level={2}
          className="text-primary-dark"
          style={{ margin: 0 }}
        >
          {title}
        </Typography.Title>
      </Flex>
      {children}
    </Flex>
  );
};

export default PageTitle;
