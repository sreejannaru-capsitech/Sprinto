import { Button, Flex, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useState, type ReactNode } from "react";
import { USER_TEAM_LEAD } from "~/lib/const";
import { usePagedUsersQuery } from "~/lib/server/services";
import AvatarPic from "../ui/avatar-pic";
import CustomTooltip from "../ui/tooltip";
import SprintoTable from "./table";
import { PencilIcon } from "~/lib/icons";

/**
 * This component renders all-users.table section
 * @returns {ReactNode} The AllUsersTable component
 */
const AllUsersTable = (): ReactNode => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const [page, setPage] = useState<Page>({
    pageSize: 5,
    pageIndex: 1,
  });

  const { data, isPending } = usePagedUsersQuery(
    page.pageIndex,
    page.pageSize,
    filters.role
  );

  const columns: TableProps<User>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 200,
      render: (text: string, record) => (
        <Flex align="center" gap={18}>
          <AvatarPic user={record} size={24} />
          <CustomTooltip title={record.email}>
            <span>{text}</span>
          </CustomTooltip>
        </Flex>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      width: 200,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Employee", value: "employee" },
        { text: "Team Lead", value: "teamLead" },
      ],
      render: (text: UserRole) => (
        <Tag className="capitalize">
          {text === USER_TEAM_LEAD ? "Team Lead" : text}
        </Tag>
      ),
    },
    {
      title: "Joined On",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 100,
      render: (text: Creation) => (
        <CustomTooltip title={text.time}>
          <span>{dayjs(text.time).format("Do MMM YYYY")}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Registered By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 100,
      render: (text: Creation) => (
        <CustomTooltip title={text.userName}>
          <span>{text.userName}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 50,
      render: (text: User) => (
        <Button size="small" icon={<PencilIcon size={18} />}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <SprintoTable
      columns={columns}
      data={data?.items ?? []}
      loading={isPending}
      pageSize={page.pageSize}
      pageIndex={page.pageIndex}
      setFilters={setFilters}
      totalCount={data?.totalCount ?? 0}
      setPage={setPage}
    />
  );
};

export default AllUsersTable;
