import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import { InboxIcon } from "~/lib/icons";
import InboxPageComponent from "~/pages/inbox.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Inbox — Sprinto" },
    { name: "description", content: "View all your assigned tasks" },
  ];
};

/**
 * This component renders inbox section
 * @returns {ReactNode} The InboxPage component
 */
const InboxPage = (): ReactNode => {
  return (
    <>
      <Flex align="center" gap={6}>
        <InboxIcon size={36} />
        <Typography.Title
          level={2}
          className="text-primary"
          style={{ margin: 0 }}
        >
          Inbox
        </Typography.Title>
      </Flex>
      <InboxPageComponent />
    </>
  );
};

export default InboxPage;
