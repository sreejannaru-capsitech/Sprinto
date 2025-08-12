import { Col, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useState, type ReactNode } from "react";
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
  const [page, setPage] = useState<Page>({
    pageSize: 6,
    pageIndex: 1,
  });
  
  const { data: allProjects, isPending: allProjPending } =
    useAllProjectsQuery();

  const columns: TableProps<Project>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      width: 250,
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
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
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      render: (alias: string) => <Tag>{alias}</Tag>,
    },
    {
      title: "Maintainer",
      dataIndex: "teamLead",
      render: (user: Assignee) => user.name,
      sorter: (a, b) => a.teamLead.name.localeCompare(b.teamLead.name),
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      width: 100,
      filters: [
        { text: "Active", value: false },
        { text: "Complete", value: true },
      ],
      onFilter: (value, record) => record.isCompleted === value,
      render: (isCompleted: boolean) => (isCompleted ? "Complete" : "Active"),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      width: 150,
      sorter: (a, b) => {
        const aDate = a.startDate ? dayjs(a.startDate).valueOf() : Infinity;
        const bDate = b.startDate ? dayjs(b.startDate).valueOf() : Infinity;
        return aDate - bDate;
      },
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
      sorter: (a, b) => {
        const aDate = a.deadline ? dayjs(a.deadline).valueOf() : Infinity;
        const bDate = b.deadline ? dayjs(b.deadline).valueOf() : Infinity;
        return aDate - bDate;
      },
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
      sorter: (a, b) =>
        a.createdBy.userName.localeCompare(b.createdBy.userName),
      render: (user: Creation) => user.userName,
    },
    {
      title: "Created On",
      dataIndex: "createdBy",
      width: 120,
      sorter: (a, b) => {
        const aDate = a.createdBy.time
          ? dayjs(a.createdBy.time).valueOf()
          : Infinity;
        const bDate = b.createdBy.time
          ? dayjs(b.createdBy.time).valueOf()
          : Infinity;
        return aDate - bDate;
      },
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
        urlString="project"
        pageIndex={page.pageIndex}
        pageSize={page.pageSize}
        totalCount={allProjects?.result?.total ?? 0}
        setPage={setPage}
      />
    </Col>
  );
};

export default AllProjectsTable;
