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
      title: "缴费单号",
      dataIndex: "jfNo",
      key: "jfNo",
    },
    {
      title: "缴费起年份",
      dataIndex: "startYear",
      key: "role",
    },
    {
      title: "缴费止年份",
      dataIndex: "endYear",
      key: "endYear",
    },
    {
      title: "缴费年数",
      dataIndex: "yearCount",
      key: "yearCount",
    },
    {
      title: "缴费金额",
      dataIndex: "money",
      key: "money",
    },
    {
      title: "缴费数量",
      dataIndex: "jfCount",
      key: "jfCount",
    },
    {
      title: "缴费类型",
      dataIndex: "type",
      key: "type",
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
