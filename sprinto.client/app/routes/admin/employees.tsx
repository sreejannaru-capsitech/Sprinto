import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import { UsersIcon } from "~/lib/icons";
import EmployeesPageComponent from "~/pages/admin/employees.page";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Employees — Sprinto" },
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
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={6}>
          <UsersIcon size={36} />
          <Typography.Title
            level={2}
            className="text-primary-dark"
            style={{ margin: 0 }}
          >
            Users
          </Typography.Title>
        </Flex>
      </Flex>
      <EmployeesPageComponent />
    </div>
  );
};

export default EmployeesPage;
