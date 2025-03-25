import { Space, type TableProps } from "antd";

interface DataType {
  key: string;
  name: string;
  role: number;
  desc: string;
  date: string;
  status: string;
  shiNo: string;
}

const caTypeMap = {
  1: "单格",
  2: "双格",
  3: "三格",
  4: "四格",
};

const columns: TableProps<DataType>["columns"] = [
  {
    title: "寄存证编号",
    dataIndex: "jczNo",
    key: "jczNo",
    fixed: "left",
    width: 150,
  },
  {
    title: "室号",
    dataIndex: "roomNo",
    key: "roomNo",
    fixed: "left",
    width: 100,
  },
  {
    title: "格号",
    dataIndex: "caNo",
    key: "caNo",
  },
  {
    title: "格类型",
    dataIndex: "caType",
    key: "caType",
    render: (caType: 1 | 2 | 3 | 4) => {
      return caTypeMap[caType];
    },
  },
  {
    title: "开户日期",
    dataIndex: "created",
    key: "created",
  },

  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>详情</a>
      </Space>
    ),
  },
];

const data: DataType[] = [];

export { columns, data };
