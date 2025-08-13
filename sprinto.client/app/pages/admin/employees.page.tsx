import { Col, Row, Typography } from "antd";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import BarChart from "~/components/charts/bar.chart";
import PieChart from "~/components/charts/pie.chart";
import AllUsersTable from "~/components/tables/all-users.table";
import RecentActivityTable from "~/components/tables/recent-activity.table";
import {
  useProjectAssigneeCountQuery,
  useRoleCountQuery
} from "~/lib/server/services";

const headerStyle: CSSProperties = { margin: 0, textAlign: "center" };

/**
 * This component renders employees.page section
 * @returns {ReactNode} The EmployeesPage component
 */
const EmployeesPageComponent = (): ReactNode => {
  const { data: projectAssigneeCount, isPending: assigneePending } =
    useProjectAssigneeCountQuery();
  const { data: roleBasedCount, isPending: rolesPending } = useRoleCountQuery();

  const roleStats: PieData[] = useMemo(() => {
    if (!roleBasedCount) return [];
    return [
      {
        name: "Admin",
        value: roleBasedCount.adminCount,
      },
      {
        name: "Employee",
        value: roleBasedCount.employeeCount,
      },
      {
        name: "Team Lead",
        value: roleBasedCount.tlCount,
      },
    ];
  }, [roleBasedCount]);

  const assigneeCounts: BarData = useMemo(() => {
    if (!projectAssigneeCount?.result) return { name: [], value: [] };
    const { result } = projectAssigneeCount;
    return {
      name: result.map((item) => item.userName),
      value: result.map((item) => item.projectsCount),
    };
  }, [projectAssigneeCount]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <Row>
        <Col span={8}>
          <Typography.Title level={4} style={headerStyle}>
            Role Based User Count
          </Typography.Title>
          <PieChart data={roleStats} />
        </Col>
        <Col span={8}>
          <Typography.Title level={4} style={headerStyle}>
            Number of Projects Assigned
          </Typography.Title>
          <BarChart data={assigneeCounts} />
        </Col>
        <Col span={8}>
          <Typography.Title level={4} style={headerStyle}>
            Most Recent User Activities
          </Typography.Title>
          <RecentActivityTable />
        </Col>
      </Row>

      <Row style={{ marginTop: "3rem" }}>
        <AllUsersTable />
      </Row>
    </div>
  );
};

export default EmployeesPageComponent;
