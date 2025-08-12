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
  setFilters?: Dispatch<SetStateAction<Record<string, any>>>;
}

/**
 * This component renders a paginated, filterable table
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
  setFilters,
}: SprintoTableProps<T>): ReactNode => {
  const navigate = useNavigate();

  return (
    <Table<T>
      size="small"
      columns={columns}
      rowKey={(record: any) => record.id}
      loading={loading}
      dataSource={data}
      style={{ width: "100%" }}
      tableLayout="fixed"
      onRow={(record: any) => ({
        onClick: () =>
          navigate(
            urlString === "project"
              ? `/projects/${record.id}`
              : `/projects/${record.projectId}/tasks/${record.id}`
          ),
        style: { cursor: "pointer" },
      })}
      onChange={(pagination, newFilters) => {
        // Update pagination
        setPage((prev) => ({
          ...prev,
          pageIndex: pagination.current ?? 1,
        }));

        // Apply filters for server-side querying
        if (!setFilters) return;
        setFilters((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(newFilters).map(([key, value]) => [
              key,
              Array.isArray(value) ? value[0] : value,
            ])
          ),
        }));
      }}
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
        showQuickJumper: true,
      }}
    />
  );
};

export default SprintoTable;
