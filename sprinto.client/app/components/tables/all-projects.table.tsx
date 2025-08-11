import { Col, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { type ReactNode } from "react";
import { useAllProjectsQuery } from "~/lib/server/services";
import { truncateText } from "~/lib/utils";
import CustomTooltip from "../ui/tooltip";
import SprintoTable from "./table";

/**
 * This component renders all-projects.table section
 * @param {AllProjectsTableProps} props
 * @returns {ReactNode} The AllProjectsTable component
 */
const AllProjectsTable = (): ReactNode => {
  const { data: allProjects, isPending: allProjPending } =
    useAllProjectsQuery();

  const columns: TableProps<Project>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      width: 250,
      ellipsis: true,
      render: (title: string) => (
        <CustomTooltip title={title}>
          <span>{truncateText(title, 25)}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 400,
      render: (description: string) => (
        <CustomTooltip title={description}>
          <span>{truncateText(description, 60)}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Alias",
      dataIndex: "alias",
      width: 90,
      render: (alias: string) => <Tag>{alias}</Tag>,
    },
    {
      title: "Maintainer",
      dataIndex: "teamLead",
      render: (user: Assignee) => user.name,
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      width: 100,
      render: (isCompleted: boolean) => (isCompleted ? "Complete" : "Active"),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      width: 150,
      render: (date: string) =>
        date ? (
          <CustomTooltip title={dayjs(date).format("Do MMMM YYYY")}>
            <span>{dayjs(date).format("Do MMM YYYY")}</span>
          </CustomTooltip>
        ) : (
          "Not Started"
        ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      width: 150,
      render: (date?: string) =>
        date ? (
          <CustomTooltip title={dayjs(date).format("Do MMMM YYYY")}>
            <span>{dayjs(date).format("Do MMM YYYY")}</span>
          </CustomTooltip>
        ) : (
          "Not Decided"
        ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      width: 120,
      render: (user: Creation) => (
        <CustomTooltip title={dayjs(user.time).format("Do MMMM YYYY")}>
          <span>{dayjs(user.time).format("Do MMM YY")}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Created On",
      dataIndex: "createdBy",
      width: 120,
      render: (user: Creation) => (
        <CustomTooltip title={dayjs(user.time).format("Do MMMM YYYY")}>
          <span>{dayjs(user.time).format("Do MMM YY")}</span>
        </CustomTooltip>
      ),
    },
  ];

  return (
    <Col span={24}>
      <SprintoTable<Project>
        columns={columns}
        data={allProjects?.result?.projects ?? []}
        loading={allProjPending}
        urlString="/projects/"
      />
    </Col>
  );
};

export default AllProjectsTable;
