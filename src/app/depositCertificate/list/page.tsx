"use client";
import { Table, theme } from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import { columns, data, expandColumns } from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { useCallback, useEffect, useState } from "react";
import { JCZFilter, JXDataType } from "@/utils/types";
import { jczApi } from "../api";
import { useSetRoomList } from "@/utils/store/useConfigStore";

export default function User() {
  const { token } = theme.useToken();
  const [listData, setListData] = useState(data);
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [selectedList, setSelectedList] = useState<JXDataType[] | undefined>(
    []
  );
  const [total, setTotal] = useState(0);
  const [jczFilter, setJCZFilter] = useState<JCZFilter>({ roomNo: "A101" });
  const setRoomList = useSetRoomList();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const initJCZList = useCallback(async () => {
    const jczListQuery = {
      ...jczFilter,
      pageNum,
      pageSize,
    };
    const { data, total } = await jczApi(jczListQuery);
    if (data) {
      setListData(data);
    }
    setTotal(total);
  }, [pageNum, pageSize, jczFilter]);

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPageNum(page);
    setPageSize(pageSize);
  }, []);

  const expandedRowRender = useCallback(() => {
    return (
      <Table<JXDataType>
        rowKey="id"
        columns={expandColumns}
        dataSource={selectedList || []}
        pagination={false}
      />
    );
  }, [selectedList]);

  useEffect(() => {
    setRoomList();
  }, [setRoomList]);

  useEffect(() => {
    initJCZList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, jczFilter]);

  const onFilter = useCallback((value: JCZFilter) => {
    setJCZFilter(value);
  }, []);

  return (
    <main className={styles.userWrap}>
      <div className={styles.content}>
        <AvaForm onFilter={onFilter} />
        <br />
        <div style={listStyle}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={listData}
            scroll={{ x: 500 }}
            pagination={{
              pageSize: pageSize,
              current: pageNum,
              onChange: onPaginationChange,
              total,
            }}
            expandable={{
              expandedRowRender,
              onExpand: (expanded, record) => {
                setSelectedList(record.jfList);
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
