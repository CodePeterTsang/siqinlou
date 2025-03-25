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

const data: DataType[] = [
  {
    key: "1",
    name: "徐小夕",
    role: 1,
    desc: "H5-Dooring作者, 掘金签约作者，知乎专栏作家",
    tags: ["前端工程师", "developer"],
  },
  {
    key: "2",
    name: "张三",
    role: 2,
    desc: "知乎专栏作家",
    tags: ["前端工程师", "developer", "Dooring"],
  },
  {
    key: "3",
    name: "李盟",
    role: 2,
    desc: "Dooring共建者",
    tags: ["后端工程师", "V6.Dooring", "Dooring"],
  },
  {
    key: "4",
    name: "王阿明",
    role: 2,
    desc: "技术合伙人",
    tags: ["全栈工程师", "橙子表单"],
  },
  {
    key: "5",
    name: "张小明",
    role: 2,
    desc: "技术合伙人",
    tags: ["全栈工程师", "橙子表单"],
  },
  {
    key: "6",
    name: "Tom",
    role: 2,
    desc: "技术合伙人",
    tags: ["全栈工程师", "Next-Admin"],
  },
  {
    key: "7",
    name: "Json",
    role: 2,
    desc: "技术合伙人",
    tags: ["全栈工程师", "Next-Admin"],
  },
];

export { columns, data };
