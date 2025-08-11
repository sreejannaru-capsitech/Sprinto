import { Table, type TableProps } from "antd";
import { useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface SprintoTableProps<T> {
  data: T[];
  loading?: boolean;
  urlString: string;
  pageSize?: number;
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
  columns,
}: SprintoTableProps<T>): ReactNode => {
  const navigate = useNavigate();

  const [page, setPage] = useState<Page>({
    pageSize: pageSize,
    pageIndex: 1,
  });

  return (
    <Table<T>
      size="small"
      columns={columns}
      rowKey={(record: any) => record.id}
      loading={loading}
      onRow={(record: any) => ({
        onClick: () => navigate(urlString + record.id),
        style: { cursor: "pointer" },
      })}
      dataSource={data}
      style={{ width: "100%" }}
      tableLayout="fixed"
      pagination={{
        pageSize: page.pageSize,
        current: page.pageIndex,
        total: data.length,
        onChange: (page) => setPage((prev) => ({ ...prev, pageIndex: page })),
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
};

export default SprintoTable;
