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
import { useSetRoomList } from "@/utils/store/useConfigStore";
import { RoomFilter } from "@/utils/types";
import { sgListApi, sgMerge } from "../api";

interface GridStyle {
  "1": React.CSSProperties;
  "2": React.CSSProperties;
  "3": React.CSSProperties;
}
interface CardData {
  caNo: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelText, setModalText] = useState<string>("");
  const [modelTitle, setModalTitle] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const setRoomList = useSetRoomList();
  const [roomData, setRoomData] = useState(data);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>({ roomNo: "A101" });
  const [roomNo, setRoomNo] = useState<string>("A101");

  /**
   * 卡片点击只能相连才能选中
   * @param card
   * @param index
   */
  function cardClick(card: CardData, index: number) {
    const selectedIndex = index;
    if (selectedCard.length && selectedIndex === selectedCard[0].index - 1) {
      setSelectedCard([
        {
          ...card,
          index: index,
        },
        ...selectedCard,
      ]);
    } else if (
      selectedCard.length &&
      selectedIndex === selectedCard[selectedCard.length - 1].index + 1
    ) {
      setSelectedCard([
        ...selectedCard,
        {
          ...card,
          index: index,
        },
      ]);
    } else {
      setSelectedCard([
        {
          ...card,
          index: index,
        },
      ]);
    }
  }

  const checkSelected = useCallback(
    (card: CardData) => {
      return selectedCard.some((item) => {
        return item.caNo === card.caNo;
      });
    },
    [selectedCard]
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const query = {
        type: modelTitle === "分拆" ? 0 : (1 as 1 | 0),
        caList: selectedCard.map((item) => ({
          roomNo: roomNo,
          caNo: item.caNo,
        })),
      };
      await sgMerge(query);
    } catch (e) {}
    initRoom();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
    setPageNum(1);
    setRoomNo(value.roomNo);
    setRoomFilter(value);
  }, []);
  return (
    <div>
      <AvaForm onFilter={onFilter} />
      <br />

      <Card
        title={`${roomNo}号室`}
        extra={
          <Flex gap="small">
            <>
              {contextHolder}
              <Button
                onClick={() => {
                  if (selectedCard.length > 1) {
                    messageApi.open({
                      type: "warning",
                      content: "分拆操作只能选择一个格号",
                    });
                    return;
                  }
                  setModalText("确定要分拆该格号吗？");
                  setModalTitle("分拆");
                  showModal();
                }}
              >
                分拆
              </Button>
              <Button
                onClick={() => {
                  if (selectedCard.length === 1) {
                    messageApi.open({
                      type: "warning",
                      content: "合并操作需要选择大于一个格号",
                    });
                    return;
                  }
                  setModalText("确定要合并该格号吗？");
                  setModalTitle("合并");
                  showModal();
                }}
              >
                合并
              </Button>
            </>
          </Flex>
        }
      >
        {roomData.map((item, index) => (
          <Card.Grid
            key={index}
            style={gridStyle[item.caType]}
            className={checkSelected(item) ? styles["card-active"] : ""}
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
          total={50}
          showSizeChanger
          onChange={onPaginationChange}
        />
      </ConfigProvider>
      <Modal
        title={modelTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{modelText}</p>
      </Modal>
    </div>
  );
};

export default App;
