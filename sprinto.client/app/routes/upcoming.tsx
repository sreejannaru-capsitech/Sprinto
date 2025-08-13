import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import PageTitle from "~/components/page-title";
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
      <PageTitle title="Upcoming" icon={<CalenderIcon size={36} />} />
      <UpcomingPageComponent />
    </>
  );
};

export default UpcomingPage;
