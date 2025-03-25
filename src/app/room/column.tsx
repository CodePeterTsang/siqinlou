import { RoomListDataType } from "@/utils/types";
import { Space, type TableProps } from "antd";

const columns: TableProps<RoomListDataType>["columns"] = [
  {
    title: "室号",
    dataIndex: "roomNo",
    key: "roomNo",
    fixed: "left",
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
  },
  {
    title: "格状态",
    dataIndex: "caStatus",
    key: "caStatus",
    render: (text) => {
      return text ? "存放" : "空";
    },
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

const data: RoomListDataType[] = [];

export { columns, data };
