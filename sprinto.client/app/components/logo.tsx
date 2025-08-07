import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import { LogoIcon } from "~/lib/icons";

import "~/styles/home.css";

/**
 * This component renders logo section
 * @returns {ReactNode} The LogoComponent component
 */
const LogoComponent = (): ReactNode => {
  return (
    <Flex gap={6} align="center" className="logo-container">
      <LogoIcon size={58} />
      <Typography.Title level={1}>
        Sprin<span className="text-primary">t</span>o
      </Typography.Title>
    </Flex>
  );
};

export default LogoComponent;
