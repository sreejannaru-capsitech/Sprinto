import { Col, Row, Statistic, Typography } from "antd";
import type { ReactNode } from "react";
import AllProjectsTable from "~/components/tables/all-projects.table";
import TopProjectTable from "~/components/tables/top-projects.table";
import {
  useAllProjectsQuery,
  useLeastActiveProjectsQuery,
  useTopActiveProjectsQuery,
} from "~/lib/server/services";

/**
 * This component renders projects section
 * @returns {ReactNode} The AdminProjectsPage component
 */
const AdminProjectsPage = (): ReactNode => {
  const { data: allProjects, isPending: allProjPending } =
    useAllProjectsQuery();

  const { data: topProjects, isPending: topProjPending } =
    useTopActiveProjectsQuery();

  const { data: leastProjects, isPending: leastProjPending } =
    useLeastActiveProjectsQuery();

  return (
    <div style={{ marginTop: "2rem" }}>
      <Row
        justify="space-between"
      >
        <Col flex="130px">
          <Typography.Title level={4} className="font-bold">
            Statistics
          </Typography.Title>
          <Statistic
            title="Total Projects"
            value={allProjects?.result?.total}
          />
          <Statistic
            title="Active Projects"
            value={allProjects?.result?.active}
            style={{ marginTop: 10 }}
          />
          <Statistic
            title="Inactive Projects"
            value={allProjects?.result?.inActive}
            style={{ marginTop: 10 }}
          />
        </Col>
        <Col span={10}>
          <Typography.Title level={4} className="font-bold">
            Top Active Projects
          </Typography.Title>
          <TopProjectTable
            projects={topProjects?.result ?? []}
            pending={topProjPending}
          />
        </Col>
        <Col span={10}>
          <Typography.Title level={4} className="font-bold">
            Least Active Projects{" "}
            <span className="text-primary-dark">( Based on last 15 days )</span>
          </Typography.Title>
          <TopProjectTable
            projects={leastProjects?.result ?? []}
            pending={leastProjPending}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "2.5rem" }}>
        <AllProjectsTable />
      </Row>
    </div>
  );
};

export default AdminProjectsPage;
