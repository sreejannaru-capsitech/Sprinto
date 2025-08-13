import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import PageTitle from "~/components/page-title";
import { UsersIcon } from "~/lib/icons";
import EmployeesPageComponent from "~/pages/admin/employees.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Users — Sprinto" },
    {
      name: "description",
      content: "Manage employees and team leads with Sprinto",
    },
  ];
};

/**
 * This component renders employees section
 * @returns {ReactNode} The EmployeesPage component
 */
const EmployeesPage = (): ReactNode => {
  return (
    <div>
      <PageTitle title="Users" icon={<UsersIcon size={36} />} />
      <EmployeesPageComponent />
    </div>
  );
};

export default EmployeesPage;
