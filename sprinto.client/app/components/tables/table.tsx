import { Table, type TableProps } from "antd";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useNavigate } from "react-router";

interface SprintoTableProps<T> {
  data: T[];
  loading?: boolean;
  urlString: "project" | "task";
  pageSize: number;
  pageIndex: number;
  totalCount: number;
  setPage: Dispatch<SetStateAction<Page>>;
  columns: TableProps<T>["columns"];
}

/**
 * This component renders table section
 * @param {SprintoTableProps} props
 * @returns {ReactNode} The SprintoTable component
 */
const SprintoTable = <T,>({
  data,
  loading = false,
  urlString,
  pageSize = 5,
  pageIndex = 1,
  totalCount,
  setPage,
  columns,
}: SprintoTableProps<T>): ReactNode => {
  const navigate = useNavigate();

  return (
    <Table<T>
      size="small"
      columns={columns}
      rowKey={(record: any) => record.id}
      loading={loading}
      onRow={(record: any) => ({
        onClick: () =>
          navigate(
            urlString === "project"
              ? `/projects/${record.id}`
              : `/projects/${record.projectId}/tasks/${record.id}`
          ),
        style: { cursor: "pointer" },
      })}
      dataSource={data}
      style={{ width: "100%" }}
      tableLayout="fixed"
      pagination={{
        showTotal: (total: number) => (
          <span>
            Total <span className="text-primary-dark">{total}</span> items
          </span>
        ),
        pageSize: pageSize,
        current: pageIndex,
        total: totalCount,
        onChange: (page) => setPage((prev) => ({ ...prev, pageIndex: page })),
        // showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
};

export default SprintoTable;
