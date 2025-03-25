"use client";
import { Table, theme } from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import { columns, data } from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { sgListApi } from "./api";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useSetRoomList } from "@/utils/store/useConfigStore";
import { RoomFilter, RoomListDataType } from "@/utils/types";

export default function User() {
  const setRoomList = useSetRoomList();
  const { token } = theme.useToken();
  const [roomData, setRoomData] = useState(data);
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>({ roomNo: "A101" });

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const initRoom = useCallback(async () => {
    const roomListQuery = {
      ...roomFilter,
      pageNum,
      pageSize,
    };
    const { data, total } = await sgListApi(roomListQuery);
    if (data) {
      setRoomData(data);
    }
    setTotal(total);
  }, [pageNum, pageSize, roomFilter]);

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPageNum(page);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    setRoomList();
  }, [setRoomList]);

  useEffect(() => {
    initRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, roomFilter]);

  const onFilter = useCallback((value: RoomFilter) => {
    setRoomFilter(value);
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
            dataSource={roomData}
            pagination={{
              pageSize: pageSize,
              current: pageNum,
              onChange: onPaginationChange,
              total,
            }}
            scroll={{ x: 500 }}
          />
        </div>
      </div>
    </main>
  );
}
