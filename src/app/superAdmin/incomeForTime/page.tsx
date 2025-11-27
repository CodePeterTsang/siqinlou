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
import {
  incomeForTimeApi,
  userCreateApi,
  userEditApi,
  userListApi,
} from "../api";
import { logoutApi } from "@/app/appLogin/api";
import router from "next/router";

export default function User() {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState<IncomeForTimeDataType[]>(data);
  const [totalCount, setTotalCount] = useState(0);

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const initIncomeList = useCallback(
    async (value: any[]) => {
      try {
        if (value?.length === 2) {
          const { data } = await incomeForTimeApi({
            startTime: value[0].valueOf(),
            endTime: value[1].valueOf(),
          });
          setList(data.jfCounts);
          setTotalCount(data.totalCount);
        }
      } catch (e: any) {
        messageApi.error(e?.errorMessage);
      }
    },
    [messageApi]
  );

  const columns: TableProps<IncomeForTimeDataType>["columns"] = [
    {
      title: "时间",
      dataIndex: "created",
      key: "created",
    },
    {
      title: "收入",
      dataIndex: "count",
      key: "count",
    },
  ];

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPageNum(page);
    setPageSize(pageSize);
  }, []);

  return (
    <main className={styles.userWrap}>
      {contextHolder}
      <div className={styles.content}>
        <AvaForm
          cb={(value: any[]) => {
            initIncomeList(value);
          }}
        />
        <br />
        <div style={listStyle}>
          <Table
            rowKey="created"
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
              pageData.forEach(({ count }) => {
                totalIncome += count;
              });
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      当前页面总共金额
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {totalIncome}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>总共金额</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {totalCount}
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
