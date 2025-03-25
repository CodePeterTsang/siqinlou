import {
  FundOutlined,
  // LayoutOutlined,
  BarChartOutlined,
  DesktopOutlined,
  // ScheduleOutlined,
  // CalculatorOutlined,
  UserOutlined,
  OpenAIOutlined,
  FileExcelOutlined,
  FileMarkdownOutlined,
  LinkOutlined,
  // WalletOutlined,
  // BuildOutlined,
  // OpenAIOutlined,
  // PartitionOutlined,
  // FileExcelOutlined,
  // PieChartOutlined,
  // LinkOutlined,
  // FileMarkdownOutlined
} from "@ant-design/icons";
import React from "react";
import { getUser } from "@/utils/auth";

const getNavList = () => {
  let user = { role: "" };
  const userCookie = getUser();
  try {
    if (userCookie) {
      user = JSON.parse(userCookie);
    }
  } catch (e) {
    console.log(e);
  }

  const list = [
    {
      key: "/",
      icon: <DesktopOutlined />,
      label: "寄存格管理",
      children: [
        // {
        //   key: "/room",
        //   icon: <BarChartOutlined />,
        //   label: "室格列表",
        // },
        {
          key: "/room/geManagement",
          icon: <FundOutlined />,
          label: "室格列表",
        },
      ],
    },
    {
      key: "/depositCertificate",
      icon: <OpenAIOutlined />,
      label: "寄存证管理",
      children: [
        {
          key: "/depositCertificate/list",
          icon: <OpenAIOutlined />,
          label: "寄存证搜索",
        },
        {
          key: "/depositCertificate/detail",
          icon: <FileMarkdownOutlined />,
          label: "寄存证详情",
        },
      ],
    },
    // {
    //   key: "/moveOutAndOverdueUser",
    //   icon: <FileExcelOutlined />,
    //   label: "迁出欠费用户列表",
    // },
  ];
  if (user?.role === "admin") {
    list.push({
      key: "/superAdmin",
      icon: <LinkOutlined />,
      label: "超级管理员功能",
      children: [
        {
          key: "/superAdmin/combineOrSplit",
          icon: <OpenAIOutlined />,
          label: "格合并与拆分",
        },
        {
          key: "/superAdmin/feeLimit",
          icon: <FileMarkdownOutlined />,
          label: "缴费年限设置",
        },
        {
          key: "/superAdmin/cancelFee",
          icon: <FileMarkdownOutlined />,
          label: "注销缴费单",
        },
        {
          key: "/superAdmin/userManagement",
          icon: <FileMarkdownOutlined />,
          label: "用户管理",
        },
      ],
    });
  }
  return list;
};

export default getNavList;
