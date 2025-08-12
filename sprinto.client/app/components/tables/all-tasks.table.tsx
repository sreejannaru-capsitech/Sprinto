import { Avatar, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useState, type ReactNode } from "react";
import { useAllTasksQuery } from "~/lib/server/services";
import { truncateText } from "~/lib/utils";
import AvatarPic from "../ui/avatar-pic";
import CustomTooltip from "../ui/tooltip";
import SprintoTable from "./table";

/**
 * This component renders all-tasks.table section
 * @returns {ReactNode} The AllTasksTable component
 */
const AllTasksTable = (): ReactNode => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const [page, setPage] = useState<Page>({
    pageSize: 5,
    pageIndex: 1,
  });

  const { data: allTasks, isFetching: tasksFetching } = useAllTasksQuery(
    page.pageIndex,
    page.pageSize,
    filters.priority,
    filters.status
  );

  const columns: TableProps<Task>["columns"] = [
    {
      title: "ID",
      dataIndex: "sequence",
      ellipsis: true,
      width: 40,
      render: (sequence: number, record: Task) => (
        <span>
          {record.projectAlias}-{sequence}
        </span>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string) => (
        <CustomTooltip title={title}>
          <span>{truncateText(title, 50)}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 80,
      filters: [
        { text: "Low", value: "low" },
        { text: "Medium", value: "medium" },
        { text: "High", value: "high" },
      ],
      render: (status: TaskPriority) => <Tag>{status}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 80,
      filters: [
        { text: "Done", value: "Done" },
        { text: "In Progress", value: "In Progress" },
        { text: "Todo", value: "Todo" },
      ],
      onFilter: (value, record) => record.status.title === value,
      render: (status: StatusEntity) => <Tag>{status.title}</Tag>,
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      width: 50,
      render: (assignees: Assignee[]) => (
        <Avatar.Group max={{ count: 3 }} size={20}>
          {assignees.map((assignee) => (
            <AvatarPic key={assignee.id} user={assignee} size={20} />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: 80,
      render: (dueDate: string) => dayjs(dueDate).format("Do MMM YYYY"),
    },
    {
      title: "Project",
      dataIndex: "projectAlias",
      width: 40,
      sorter: (a, b) => a.projectAlias.localeCompare(b.projectAlias),
      render: (projectAlias: string) => projectAlias,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      width: 100,
      ellipsis: true,
      sorter: (a, b) =>
        a.createdBy.userName.localeCompare(b.createdBy.userName),
      render: (user: Creation) => user.userName,
    },
    {
      title: "Created On",
      dataIndex: "createdBy",
      width: 80,
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
        <CustomTooltip title={dayjs(user.time).format("Do MMMM YYYY, h:mm a")}>
          <span>{dayjs(user.time).format("Do MMM YY")}</span>
        </CustomTooltip>
      ),
    },
  ];

  return (
    <SprintoTable<Task>
      loading={tasksFetching}
      data={allTasks?.result?.items ?? []}
      pageSize={page.pageSize}
      pageIndex={page.pageIndex}
      totalCount={allTasks?.result?.totalCount ?? 0}
      urlString="task"
      setPage={setPage}
      setFilters={setFilters}
      columns={columns}
    />
  );
};

export default AllTasksTable;
