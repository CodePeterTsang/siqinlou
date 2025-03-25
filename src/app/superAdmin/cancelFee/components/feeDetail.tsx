"use client";
import { JXDataType } from "@/utils/types";
import { Table, TableProps, theme } from "antd";

export default function FeeDetail({
  list,
}: {
  list: JXDataType[] | undefined;
}) {
  const { token } = theme.useToken();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const columns: TableProps<JXDataType>["columns"] = [
    {
      title: "年份",
      dataIndex: "startYear",
      key: "startYear",
      render: (startYear, record) => `${startYear}-${record.endYear}`,
    },
    {
      title: "份数",
      dataIndex: "jfCount",
      key: "jfCount",
    },
    {
      title: "金额",
      dataIndex: "money",
      key: "money",
    },
  ];

  return (
    <main style={{ height: "100%" }}>
      <div style={listStyle}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 500 }}
        />
      </div>
    </main>
  );
}
