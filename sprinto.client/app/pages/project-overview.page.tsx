import {
  Avatar,
  Col,
  Flex,
  Row,
  Space,
  Statistic,
  Tag,
  Typography
} from "antd";
import dayjs from "dayjs";
import { useMemo, type FC, type ReactNode } from "react";
import type { BarData, PieData } from "~/components/charts";
import BarChart from "~/components/charts/bar.chart";
import TaskStatusChart from "~/components/charts/pie.chart";
import ActivityItem from "~/components/ui/activity-item";
import ProjectTiming from "~/components/ui/project-timing";
import Spinner from "~/components/ui/spinner";
import TaskContainer from "~/components/ui/task-container";
import ToolTip from "~/components/ui/tooltip";
import {
  useProjectActivitiesQuery,
  useProjectOverviewQuery
} from "~/lib/server/services";
import { getInitials } from "~/lib/utils";

import "~/styles/project-overview.css";

interface ProjectOverviewProps {
  proj: Project;
}

/**
 * This component renders project-overview.page section
 * @param {ProjectOverviewProps} props
 * @returns {ReactNode} The ProjectOverview component
 */
const ProjectOverview: FC<ProjectOverviewProps> = ({
  proj,
}: ProjectOverviewProps): ReactNode => {
  const { data: activities } = useProjectActivitiesQuery(proj.id);
  const { data: overview, isPending: overviewPending } =
    useProjectOverviewQuery(proj.id);

  const statusData: PieData[] = useMemo(() => {
    if (!overview?.result?.statusGroups) return [];
    return overview?.result?.statusGroups.map((g) => ({
      name: g.group,
      value: g.count,
    }));
  }, [overview?.result?.statusGroups]);

  const assigneeData: BarData = useMemo(() => {
    if (!overview?.result?.assigneeGroups) return { name: [], value: [] };
    return {
      name: overview?.result?.assigneeGroups.map((g) => g.group),
      value: overview?.result?.assigneeGroups.map((g) => g.count),
    };
  }, [overview?.result?.assigneeGroups]);

  return (
    <Row gutter={50} wrap={false}>
      <Col flex={"auto"}>
        <Flex align="center" justify="space-between">
          {/* Title and Timing */}
          <Flex align="center" gap={20}>
            <Typography.Title level={2}>
              {proj.title}
              <span> — </span>
              <span className="text-primary-dark">{proj.alias}</span>
            </Typography.Title>

            <Flex gap={4} align="center" justify="center">
              <ProjectTiming proj={proj} />
            </Flex>
          </Flex>

          {/* Project Assignees & Team Lead */}
          <Flex align="center" gap={20}>
            <Flex align="center" gap={4}>
              <Avatar.Group
                max={{
                  count: 4,
                  style: { color: "black", backgroundColor: "white" },
                }}
              >
                {proj.assignees.map((assignee) => (
                  <Avatar key={assignee.id}>
                    <ToolTip title={assignee.name}>
                      <span className="small-text">
                        {getInitials(assignee.name)}
                      </span>
                    </ToolTip>
                  </Avatar>
                ))}
                <Avatar key={proj.teamLead.id}>
                  <ToolTip title={proj.teamLead.name}>
                    <span className="small-text">
                      {getInitials(proj.teamLead.name)}
                    </span>
                  </ToolTip>
                </Avatar>
              </Avatar.Group>
            </Flex>
            <Tag style={{ padding: "4px 8px", fontSize: 14, borderRadius: 9 }}>
              Team Lead - {proj.teamLead.name}
            </Tag>
          </Flex>
        </Flex>
        <div className="project-description">
          <Typography.Paragraph>{proj.description}</Typography.Paragraph>
        </div>

        {/* Statistics Section */}
        <Spinner isActive={overviewPending}>
          <div style={{ padding: "40px 10px" }}>
            <Flex align="center" gap={200} justify="space-around">
              <Statistic
                title="Total Tasks"
                value={overview?.result?.totaltasks}
              />

              <Statistic
                title="Last Activity"
                value={dayjs(
                  activities?.result![0].activity.createdBy.time
                ).format("Do MMM")}
              />

              <Statistic
                title="Pending Tasks"
                value={overview?.result?.pendingTasks}
                suffix={`/ ${overview?.result?.totaltasks}`}
              />

              <Statistic
                title="Task Completion"
                value={
                  ((overview?.result?.totaltasks! -
                    overview?.result?.pendingTasks!) /
                    overview?.result?.totaltasks!) *
                  100
                }
                precision={2}
                suffix={` %`}
              />
            </Flex>
            <Flex gap={20} justify="space-around" style={{ marginTop: 30 }}>
              <TaskStatusChart data={statusData} />
              <BarChart data={assigneeData} />
              {overview?.result?.lastCompleted.length ? (
                <TaskContainer
                  text="Last Completed Tasks"
                  tasks={overview?.result?.lastCompleted ?? []}
                  setTask={() => {}}
                  height={320}
                />
              ) : (
                <div style={{ width: "380px" }}>
                  <Typography.Title level={4} className="font-bold">
                    Last Completed Tasks
                  </Typography.Title>
                  <Typography.Paragraph
                    className="text-primary"
                    style={{ marginTop: 20 }}
                  >
                    No task is complete yet
                  </Typography.Paragraph>
                </div>
              )}
            </Flex>
          </div>
        </Spinner>
      </Col>

      {/* Timeline Section */}
      <Col flex={"410px"}>
        <Typography.Title level={2}>Timeline</Typography.Title>
        <div className="activity-container">
          <Space
            direction="vertical"
            size={16}
            className="activity-container-inner"
          >
            {activities?.result?.map((a) => (
              <ActivityItem key={a.activity.id} item={a} />
            ))}
          </Space>
        </div>
      </Col>
    </Row>
  );
};

export default ProjectOverview;
