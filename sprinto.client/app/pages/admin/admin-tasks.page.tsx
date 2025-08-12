import { Col, Row, Typography } from "antd";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import BarChart from "~/components/charts/bar.chart";
import PieChart from "~/components/charts/pie.chart";
import AllTasksTable from "~/components/tables/all-tasks.table";
import Spinner from "~/components/ui/spinner";
import { useTaskStatsQuery } from "~/lib/server/services";

/**
 * This component renders admin-tasks.page section
 * @returns {ReactNode} The AdminTasksPage component
 */
const AdminTasksPage = (): ReactNode => {
  const { data: taskStats, isPending: statsPending } = useTaskStatsQuery();

  const contributorData: BarData = useMemo(() => {
    if (statsPending) return { name: [], value: [] };
    if (!taskStats?.result?.topContributors) return { name: [], value: [] };
    return {
      name: taskStats?.result?.topContributors.map((g) => g.name),
      value: taskStats?.result?.topContributors.map((g) => g.count),
    };
  }, [taskStats?.result?.topContributors, statsPending]);

  const textCenter: CSSProperties = {
    textAlign: "center",
    marginBottom: 0,
  };

  return (
    <Spinner isActive={statsPending}>
      <div style={{ marginTop: "2rem" }}>
        {/* Tasks Statistics */}
        <Row align="middle">
          <Col span={3} style={{ textAlign: "center" }}>
            <Typography.Text>Total Tasks</Typography.Text>
            <Typography.Title>{taskStats?.result?.totalTasks}</Typography.Title>
          </Col>

          <Col span={7}>
            <Typography.Title style={textCenter} level={4}>
              Tasks Breakdown by Status
            </Typography.Title>
            <PieChart data={taskStats?.result?.statusBreakdown ?? []} />
          </Col>

          <Col span={7}>
            <Typography.Title style={textCenter} level={4}>
              Top Tasks Contributors
            </Typography.Title>
            <BarChart data={contributorData} />
          </Col>

          <Col span={7}>
            <Typography.Title style={textCenter} level={4}>
              Top Projects with Highest Tasks
            </Typography.Title>
            <PieChart data={taskStats?.result?.projectInsight ?? []} />
          </Col>
        </Row>

        {/* Tasks Table */}
        <Row style={{ marginTop: "2rem" }}>
          <AllTasksTable />
        </Row>
      </div>
    </Spinner>
  );
};

export default AdminTasksPage;
