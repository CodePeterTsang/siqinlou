"use client";
import {
  Form,
  Input,
  Modal,
  Space,
  Table,
  TableProps,
  theme,
  message,
  Button,
  Select,
} from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import { data, IncomeForTimeDataType } from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { useCallback, useEffect, useState } from "react";
import { userCreateApi, userEditApi, userListApi } from "../api";
import { logoutApi } from "@/app/login/api";
import router from "next/router";
type UserFieldType = {
  userNo?: string;
  userName?: string;
  password?: string;
  newPassword: string;
  role: string;
};
export default function User() {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState<IncomeForTimeDataType[]>(data);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const initUserList = useCallback(
    async (value?: string) => {
      try {
        const { data } = await userListApi({ userNo: value });
        setList(data);
      } catch (e: any) {
        messageApi.error(e?.errorMessage);
      }
    },
    [messageApi]
  );

  const handleAdd = () => {
    setIsAdd(true);
  };

  const onLogout = async (userNo: string) => {
    try {
      await logoutApi(userNo);
      messageApi.success("解除登录成功");
      initUserList();
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
  };

  const columns: TableProps<IncomeForTimeDataType>["columns"] = [
    {
      title: "时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "收入",
      dataIndex: "income",
      key: "income",
    },
  ];

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPageNum(page);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    initUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAdd || isEdit) {
      initUserList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd, isEdit]);

  return (
    <main className={styles.userWrap}>
      {contextHolder}
      <div className={styles.content}>
        {/* <AvaForm
          cb={(value) => {
            initUserList(value);
          }}
        />
        <br /> */}
        <div style={listStyle}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={{
              pageSize: pageSize,
              current: pageNum,
              onChange: onPaginationChange,
              total,
            }}
            scroll={{ x: 500 }}
            summary={(pageData) => {
              let totalIncome = 0;
              pageData.forEach(({ time, income }) => {
                totalIncome += income;
              });
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>总共</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {totalIncome}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </div>
      </div>
    </main>
  );
}
