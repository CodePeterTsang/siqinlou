"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Pagination,
  ConfigProvider,
  Button,
  Flex,
  Modal,
  message,
} from "antd";
import type { PaginationProps } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import AvaForm from "./AvaForm";
import styles from "./index.module.less";
import { useRouter } from "next/navigation";
import { useSetRoomList } from "@/utils/store/useConfigStore";
import { RoomFilter } from "@/utils/types";
import { sgListApi } from "../api";

interface GridStyle {
  "1": React.CSSProperties;
  "2": React.CSSProperties;
  "3": React.CSSProperties;
}
interface CardData {
  caNo: string | number;
  caType: "1" | "2" | "3";
}

interface SelectedCard extends CardData {
  index: number;
}
const gridStyle: GridStyle = {
  "1": {
    width: "25%",
    textAlign: "center",
  },
  "2": {
    width: "50%",
    textAlign: "center",
  },
  "3": {
    width: "75%",
    textAlign: "center",
  },
};
const gridThreeStyle: React.CSSProperties = {
  width: "75%",
  textAlign: "center",
};
const data: CardData[] = [];

const App: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<SelectedCard[]>([]);
  const [roomNo, setRoomNo] = useState<string>("A101");
  // const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const setRoomList = useSetRoomList();
  const [roomData, setRoomData] = useState(data);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>({ roomNo: "A101" });

  useEffect(() => {
    setRoomList();
  }, [setRoomList]);

  function cardClick(card: CardData, index: number) {
    router.push(
      `/depositCertificate/detail?roomNo=${roomNo}&caNo=${card.caNo}`
    );
  }

  const checkSelected = useCallback(
    (card: CardData) => {
      return selectedCard.some((item) => {
        return item.caNo === card.caNo;
      });
    },
    [selectedCard]
  );

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
    initRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, roomFilter]);

  const onFilter = useCallback((value: RoomFilter) => {
    setPageNum(1);
    setRoomNo(value.roomNo);
    setRoomFilter(value);
  }, []);

  return (
    <div>
      <AvaForm onFilter={onFilter} />
      <br />

      <Card title={`${roomNo}号室`}>
        {roomData.map((item, index) => (
          <Card.Grid
            key={index}
            style={gridStyle[item.caType]}
            className={styles["card-active"]}
            onClick={() => {
              cardClick(item, index);
            }}
          >
            {item.caNo}号格
          </Card.Grid>
        ))}
      </Card>
      <br />
      <ConfigProvider locale={zhCN}>
        <Pagination
          defaultCurrent={1}
          align="end"
          total={total}
          current={pageNum}
          showSizeChanger
          onChange={onPaginationChange}
        />
      </ConfigProvider>
    </div>
  );
};

export default App;
