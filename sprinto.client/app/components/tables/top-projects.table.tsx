import { Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { type FC, type ReactNode } from "react";
import CustomTooltip from "~/components/ui/tooltip";
import { truncateText } from "~/lib/utils";
import SprintoTable from "./table";

interface TopProjectTableProps {
  projects: TopProjects[];
  pending?: boolean;
}

/**
 * This component renders top-projects-table section
 * @param {TopProjectTableProps} props
 * @returns {ReactNode} The TopProjectTable component
 */
const TopProjectTable: FC<TopProjectTableProps> = ({
  projects,
  pending = false,
}: TopProjectTableProps): ReactNode => {
  const columns: TableProps<TopProjects>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string) => (
        <CustomTooltip title={title}>
          <span>{truncateText(title, 24)}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Alias",
      dataIndex: "alias",
      width: 80,
      render: (alias: string) => <Tag>{alias}</Tag>,
    },
    {
      title: "Activities",
      dataIndex: "activityCount",
      width: 90,
      render: (count: number) => (
        <span style={{ color: count <= 10 ? "var(--color-red)" : "" }}>
          {count}
        </span>
      ),
    },
    {
      title: "Maintainer",
      dataIndex: "maintainer",
      render: (user: Assignee) => user.name,
      width: 120,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      width: 120,
      render: (date: string) =>
        date ? (
          <CustomTooltip title={dayjs(date).format("Do MMMM YYYY")}>
            <span>{dayjs(date).format("Do MMM")}</span>
          </CustomTooltip>
        ) : (
          "Not Decided"
        ),
    },
  ];

  return (
    <SprintoTable<TopProjects>
      columns={columns}
      data={projects}
      loading={pending}
      urlString="/projects/"
    />
  );
};

export default TopProjectTable;
