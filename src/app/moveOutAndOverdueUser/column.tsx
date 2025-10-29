import { Space, type TableProps } from "antd";

interface DataType {
  key: string;
  name: string;
  role: number;
  desc: string;
  tags: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "室号",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
    fixed: "left",
    width: 100,
  },
  {
    title: "格号",
    dataIndex: "role",
    key: "role",
    render: (role) => (role === 1 ? "超级管理员" : "使用者"),
  },
  {
    title: "格类型",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "格状态",
    dataIndex: "desc",
    key: "desc",
  },

  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>导出</a>
      </Space>
    ),
  },
];

const data: DataType[] = [];

export { columns, data };
