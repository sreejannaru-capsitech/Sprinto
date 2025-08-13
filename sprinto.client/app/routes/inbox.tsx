import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import PageTitle from "~/components/page-title";
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
      <PageTitle title="Inbox" icon={<InboxIcon size={36} />} />
      <InboxPageComponent />
    </>
  );
};

export default InboxPage;
