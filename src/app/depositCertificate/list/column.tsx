import { JCZDataType, JXDataType } from "@/utils/types";
import { Space, TableColumnsType, type TableProps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

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

const columns: TableProps<JCZDataType>["columns"] = [
  {
    title: "寄存证编号",
    dataIndex: "jczNo",
    key: "jczNo",
    fixed: "left",
  },
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
    title: "委办人姓名",
    dataIndex: "wbrName",
    key: "wbrName",
  },
  {
    title: "先人信息",
    dataIndex: "xrList",
    key: "xrList",
    render: (xrList) => {
      return xrList.map((item: any) => item.xrName).join(",");
    },
  },
  {
    title: "缴费止日期",
    dataIndex: "jfList",
    key: "jfList",
    render: (jfList) => {
      if (jfList && jfList.length) {
        return jfList[0]?.created;
      }
    },
  },

  {
    title: "欠费年数",
    dataIndex: "jfEndYear",
    key: "jfEndYear",
    render: (jfEndYear) => {
      if (jfEndYear && jfEndYear < dayjs().year()) {
        return dayjs().year() - jfEndYear;
      } else {
        return 0;
      }
    },
  },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link
          href={`/depositCertificate/detail?roomNo=${record.roomNo}&caNo=${record.caNo}`}
        >
          详情
        </Link>
      </Space>
    ),
  },
];

const expandColumns: TableColumnsType<JXDataType> = [
  { title: "缴费单号", dataIndex: "jfNo", key: "jfNo" },
  { title: "金额", dataIndex: "money", key: "money" },

  { title: "数量", dataIndex: "jfCount", key: "jfCount" },
  { title: "起年份", dataIndex: "startYear", key: "startYear" },
  { title: "止年份", dataIndex: "endYear", key: "endYear" },
  { title: "年数", dataIndex: "yearCount", key: "yearCount" },
  { title: "缴费类型", dataIndex: "type", key: "type" },
  { title: "缴费日期", dataIndex: "created", key: "created" },
];

const data: JCZDataType[] = [];

export { columns, data, expandColumns };
