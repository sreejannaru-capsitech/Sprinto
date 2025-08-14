import {
  Avatar,
  Button,
  Col,
  Flex,
  Modal,
  Popconfirm,
  Row,
  Statistic,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import BarChart from "~/components/charts/bar.chart";
import PieChart from "~/components/charts/pie.chart";
import ProjectForm from "~/components/forms/project-form";
import TaskContainer from "~/components/task-container";
import TimeLineSection from "~/components/timeline-section";
import AvatarPic from "~/components/ui/avatar-pic";
import ProjectTiming from "~/components/ui/project-timing";
import Spinner from "~/components/ui/spinner";
import { useAntNotification } from "~/hooks";
import { USER_ADMIN } from "~/lib/const";
import {
  AlertIcon,
  DeleteIcon,
  PencilIcon,
  TaskIcon,
  TickRoundedIcon,
  UsersIcon,
} from "~/lib/icons";
import {
  useDeleteProject,
  useMarkProjectCompleted,
  useProjectActivitiesQuery,
  useProjectOverviewQuery,
} from "~/lib/server/services";
import type { RootState } from "~/lib/store";

import CustomTag from "~/components/ui/custom-tag";
import "~/styles/project-overview.css";

/**
 * This component renders project-overview.page section
 * @param {ProjectOverviewProps} props
 * @returns {ReactNode} The ProjectOverview component
 */
const ProjectOverview = (): ReactNode => {
  const proj = useSelector(
    (state: RootState) => state.project.project
  ) as Project;
  const user = useSelector((state: RootState) => state.user.user) as User;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { _api, contextHolder } = useAntNotification();

  const { data: activities, isPending: _actPending } =
    useProjectActivitiesQuery(proj.id);
  const { data: overview, isPending: overviewPending } =
    useProjectOverviewQuery(proj.id);
  const { mutateAsync: deleteProject } = useDeleteProject(_api);
  const { mutateAsync: markProjectCompleted } = useMarkProjectCompleted(_api);

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
      <ProjectForm
        project={proj}
        open={isEdit}
        onClose={() => setIsEdit(false)}
      />
      {contextHolder}
      <Col flex={"auto"}>
        <Flex align="center" justify="space-between">
          {/* Title and Timing */}
          <Flex align="center" gap={12}>
            <Typography.Title level={2}>
              {proj.title}
              <span> — </span>
              <span className="text-primary-dark">{proj.alias}</span>
            </Typography.Title>

            <Modal
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              title="PERMENANTLY DELETE PROJECT ?"
              okText="Delete"
              centered
              onOk={async () => {
                await deleteProject(proj.id);
                setModalOpen(false);
                navigate("/projects", { replace: true });
              }}
            >
              <div>
                The employees amd team leader will no longer be able to access
                this project. Are you sure, you want to delete this project?
              </div>
            </Modal>

            <Flex align="center" gap={20}>
              <Flex gap={4} align="center" justify="center">
                {/* Show edit & delete buttons only for admins */}
                {user.role === USER_ADMIN && (
                  <>
                    <Button
                      type="text"
                      icon={<PencilIcon size={20} />}
                      onClick={() => setIsEdit(true)}
                    />
                    <Button
                      style={{ marginRight: 6 }}
                      type="text"
                      onClick={() => setModalOpen(true)}
                      icon={<DeleteIcon size={20} />}
                    />
                  </>
                )}
              </Flex>
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
                  <AvatarPic user={assignee} key={assignee.id} />
                ))}
                <AvatarPic user={proj.teamLead} />
              </Avatar.Group>
            </Flex>
            <CustomTag large text={`Team Lead - ${proj.teamLead.name}`} />
          </Flex>
        </Flex>

        <Flex align="center" gap={20} style={{ margin: "20px 0" }}>
          <ProjectTiming proj={proj} gap={4} />
          {user.role === USER_ADMIN && proj.isCompleted === false && (
            <Popconfirm
              icon={<AlertIcon size={20} />}
              title="Mark as Completed ?"
              onConfirm={async () => await markProjectCompleted(proj.id)}
            >
              <Button type="text" icon={<TickRoundedIcon />} />
            </Popconfirm>
          )}
          <NavLink to={`/projects/${proj.id}/tasks`}>
            <Button icon={<TaskIcon size={20} />}>Tasks</Button>
          </NavLink>
          <NavLink to={`/projects/${proj.id}/team`}>
            <Button icon={<UsersIcon size={20} />}>Team</Button>
          </NavLink>
        </Flex>
        <div className="project-description">
          <Typography.Paragraph>{proj.description}</Typography.Paragraph>
        </div>

        <Spinner isActive={overviewPending} fullscreen>
          {/* Statistics Section */}
          <div style={{ padding: "20px 10px 10px 0" }}>
            <Flex align="center" gap={200} justify="space-around">
              <Statistic
                title="Total Tasks"
                value={overview?.result?.totaltasks}
              />

              <Statistic
                title="Last Activity"
                value={
                  activities?.result?.length
                    ? dayjs(
                        activities?.result![0].activity.createdBy.time
                      ).format("Do MMM")
                    : "No activity yet"
                }
              />

              <Statistic
                title="Pending Tasks"
                value={overview?.result?.pendingTasks}
                suffix={`/ ${overview?.result?.totaltasks}`}
              />

              <Statistic
                title="Task Completion"
                value={
                  overview?.result?.totaltasks
                    ? ((overview?.result?.totaltasks! -
                        overview?.result?.pendingTasks!) /
                        overview?.result?.totaltasks!) *
                      100
                    : 0
                }
                precision={1}
                suffix={` %`}
              />
            </Flex>
            <Flex gap={20} justify="space-around" style={{ marginTop: 30 }}>
              <PieChart data={statusData} />
              <div style={{ width: "100%" }}>
                <BarChart data={assigneeData} />
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                    textAlign: "center",
                    marginTop: -30,
                    marginRight: -48,
                  }}
                  className="font-bold"
                >
                  Team Breakdown by Tasks
                </Typography.Title>
              </div>
              {overview?.result?.lastCompleted.length ? (
                <TaskContainer
                  text="Last Completed Tasks"
                  tasks={overview?.result?.lastCompleted ?? []}
                  height={320}
                />
              ) : (
                <div style={{ minWidth: "380px" }}>
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
      <TimeLineSection
        activities={activities?.result ?? []}
        isPending={_actPending}
      />
    </Row>
  );
};

export default ProjectOverview;
