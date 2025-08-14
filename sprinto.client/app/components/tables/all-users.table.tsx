import { Button, Col, Flex, Input, type TableProps } from "antd";
import dayjs from "dayjs";
import { useState, type ReactNode } from "react";
import { PencilIcon, SearchIcon } from "~/lib/icons";
import { usePagedUsersQuery } from "~/lib/server/services";
import UserUpdateForm from "../forms/user-update.form";
import AvatarPic from "../ui/avatar-pic";
import CustomTag from "../ui/custom-tag";
import CustomTooltip from "../ui/tooltip";
import SprintoTable from "./table";

/**
 * This component renders all-users.table section
 * @returns {ReactNode} The AllUsersTable component
 */
const AllUsersTable = (): ReactNode => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [page, setPage] = useState<Page>({
    pageSize: 4,
    pageIndex: 1,
  });

  const { data, isPending } = usePagedUsersQuery(
    page.pageIndex,
    page.pageSize,
    filters.role,
    search.length > 0 ? search : undefined
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) setSearch("");
    setSearchInput(e.target.value);
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      render: (text: UserRole) => <CustomTag role={text} />,
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
      render: (_, record) => (
        <Button
          size="small"
          icon={<PencilIcon size={18} />}
          onClick={() => {
            setUser(record);
            setOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Col span={24}>
      <UserUpdateForm
        open={open}
        onClose={() => {
          setOpen(false);
          setUser(null);
        }}
        user={user}
      />

      <Flex align="center" gap={20} style={{ margin: "20px 0", width: 400 }}>
        <Input
          placeholder="Name or email"
          value={searchInput}
          onChange={onInputChange}
          allowClear
        />
        <Button
          icon={<SearchIcon fill="white" size={20} />}
          type="primary"
          onClick={() => setSearch(searchInput)}
        >
          Search
        </Button>
      </Flex>

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
    </Col>
  );
};

export default AllUsersTable;
