import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import { CalenderIcon } from "~/lib/icons";
import UpcomingPageComponent from "~/pages/upcoming.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Upcoming — Sprinto" },
    { name: "description", content: "View all your upcoming tasks" },
  ];
};

/**
 * This component renders inbox section
 * @returns {ReactNode} The UpcomingPage component
 */
const UpcomingPage = (): ReactNode => {
  return (
    <>
      <Flex align="center" gap={6}>
        <CalenderIcon size={36} />
        <Typography.Title
          level={2}
          className="text-primary-dark"
          style={{ margin: 0 }}
        >
          Upcoming
        </Typography.Title>
      </Flex>
      <UpcomingPageComponent />
    </>
  );
};

export default UpcomingPage;
