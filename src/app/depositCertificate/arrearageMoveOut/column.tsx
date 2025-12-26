import { JCZDataType, JXDataType } from "@/utils/types";
import {
  Button,
  Modal,
  Space,
  TableColumnsType,
  type TableProps,
  message,
} from "antd";
import dayjs from "dayjs";
import { cancelJczApi, clearPay } from "../api";
import { getUser } from "@/utils/auth";
import { managerApi } from "@/app/superAdmin/api";
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

// 模块内可设置的刷新回调，父组件可通过 setRefreshCallback 注入刷新函数
let refreshCallback:
  | ((type: "error" | "success", message: string, detailData?: any) => void)
  | undefined;
export const setRefreshCallback = (
  cb:
    | ((type: "error" | "success", message: string, detailData?: any) => void)
    | undefined
) => {
  refreshCallback = cb;
};

let printCallback: (detailData: any) => void;
export const setPrintCallback = (cb: (detailData: any) => void) => {
  printCallback = cb;
};

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
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      if (status === 0) {
        return "正常";
      } else if (status === 1) {
        return "注销";
      } else if (status === 2) {
        return "欠费迁出";
      } else if (status === 3) {
        return "清缴";
      } else {
        return "未知";
      }
    },
  },
  {
    title: "操作",
    key: "action",
    render: (_, record) => {
      if (record.status === 0) {
        // 正常欠费状态只允许查看详情
        return (
          <Space size="middle">
            <Link
              href={`/depositCertificate/detail?roomNo=${record.roomNo}&caNo=${record.caNo}`}
            >
              详情
            </Link>
            <a
              onClick={async () => {
                const user = JSON.parse(getUser() || "{}");

                try {
                  await cancelJczApi({
                    jczNo: record?.jczNo,
                    operator: user.userName,
                    operation: 2,
                  });
                  if (refreshCallback)
                    refreshCallback("success", "欠费迁出成功");
                } catch (e: any) {
                  if (refreshCallback) refreshCallback("error", "欠费迁出失败");
                }
              }}
            >
              欠费迁出
            </a>
          </Space>
        );
      } else if (record.status === 2) {
        // 欠费迁出状态允许查看详情和清缴
        return (
          <Space size="middle">
            <Link
              href={`/depositCertificate/detail?roomNo=${record.roomNo}&caNo=${record.caNo}`}
            >
              详情
            </Link>
            <a
              onClick={async () => {
                try {
                  const { data } = await managerApi();
                  const user = JSON.parse(getUser() || "{}");

                  const { jczNo } = record;

                  const startYear = record.jfEndYear
                    ? parseInt(record.jfEndYear) + 1
                    : dayjs().year();
                  const endYear = new Date().getFullYear();
                  const feeCount = endYear - startYear + 1;
                  const xrLength = record.xrList?.length || 0;
                  const unit =
                    record.caType && record.caType > xrLength
                      ? record.caType
                      : xrLength;
                  const res = await clearPay({
                    jczNo,
                    operator: user.userName,
                    endYear: endYear.toString(),
                    money: `${feeCount * unit * 150}`,
                    jfCount: unit.toString(),
                    manager: data,
                    yearCount: feeCount.toString(),
                    startYear: startYear.toString(),
                  });
                  // 根据后端返回结构判断成功与否
                  if (res) {
                    try {
                      if (refreshCallback)
                        refreshCallback("success", "清缴成功", record);
                      // printCallback(record);
                    } catch (e) {
                      console.error("refresh callback error", e);
                      if (refreshCallback) refreshCallback("error", "清缴失败");
                    }
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              清缴
            </a>
          </Space>
        );
      }
      if (record.status === 3) {
        // 清缴状态只允许查看详情
        return (
          <Space size="middle">
            <Link
              href={`/depositCertificate/detail?roomNo=${record.roomNo}&caNo=${record.caNo}`}
            >
              详情
            </Link>
            <a
              onClick={() => {
                printCallback(record);
              }}
            >
              打印缴费单
            </a>
          </Space>
        );
      } else {
        return null;
      }
    },
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
