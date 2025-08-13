import { Flex, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useState, type ReactNode } from "react";
import { USER_TEAM_LEAD } from "~/lib/const";
import { useRecentActivityQuery } from "~/lib/server/services";
import AvatarPic from "../ui/avatar-pic";
import CustomTooltip from "../ui/tooltip";
import SprintoTable from "./table";

/**
 * This component renders recent-activity.table section
 * @returns {ReactNode} The RecentActivityTable component
 */
const RecentActivityTable = (): ReactNode => {
  const { data: recentActivity, isPending: recentPending } =
    useRecentActivityQuery();

  const [page, setPage] = useState<Page>({
    pageSize: 5,
    pageIndex: 1,
  });

  const columns: TableProps<RecentUserActivity>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 200,
      render: (text: string, record) => (
        <Flex align="center" gap={8}>
          <AvatarPic user={record} size={24} />
          <CustomTooltip title={record.email}>
            <span>{text}</span>
          </CustomTooltip>
        </Flex>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (text: UserRole) => (
        <Tag className="capitalize">
          {text === USER_TEAM_LEAD ? "Team Lead" : text}
        </Tag>
      ),
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (text: string) => (
        <CustomTooltip title={dayjs(text).format("hh:mm A Do MMMM YYYY")}>
          <span>{dayjs(text).format("hh:mm A")}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Activities",
      dataIndex: "count",
      key: "count",
      render: (text: string) => (
        <CustomTooltip title={"Total Activities: " + text}>
          <span>{text}</span>
        </CustomTooltip>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 50 }}>
      <SprintoTable<RecentUserActivity>
        columns={columns}
        data={recentActivity ?? []}
        loading={recentPending}
        pageSize={page.pageSize}
        pageIndex={page.pageIndex}
        setPage={setPage}
        totalCount={recentActivity?.length ?? 0}
      />
    </div>
  );
};

export default RecentActivityTable;
