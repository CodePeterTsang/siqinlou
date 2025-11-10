"use client";
import { Table, theme, Button, message, Modal } from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import {
  columns,
  data,
  expandColumns,
  setRefreshCallback,
  setPrintCallback,
} from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { useCallback, useEffect, useRef, useState } from "react";
import { JCZDataType, JCZFilter, JXDataType } from "@/utils/types";
import { jczApi, exportJcz } from "../api";
import { DownloadOutlined } from "@ant-design/icons";
import { useSetRoomList } from "@/utils/store/useConfigStore";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { stat } from "fs";
import PrintContent from "../detail/components/printContent";
import { useReactToPrint } from "react-to-print";

export default function User() {
  const { token } = theme.useToken();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const [listData, setListData] = useState(data);
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [selectedList, setSelectedList] = useState<JXDataType[] | undefined>(
    []
  );
  const [total, setTotal] = useState(0);
  const [jczFilter, setJCZFilter] = useState<JCZFilter>({});
  const setRoomList = useSetRoomList();
  const [messageApi, messageContextHolder] = message.useMessage();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const handleSearch = useCallback(() => {
    const param = new URLSearchParams();
    param.set("pageSize", pageSize.toString());
    param.set("pageNum", pageNum.toString());
    param.set("jczFilter", JSON.stringify(jczFilter));
    replace(`${pathName}?${param.toString()}`);
  }, [pageSize, pageNum, jczFilter]);

  const initJCZList = useCallback(async () => {
    const jczListQuery = {
      ...jczFilter,
      jfStatus: false,
      pageNum,
      pageSize,
    };
    const { data, total } = await jczApi(jczListQuery);
    if (data) {
      setListData(data);
    }
    setTotal(total);
    handleSearch();
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
    setRefreshCallback((type: "error" | "success", message: string) => {
      if (type === "error") {
        messageApi.error(message);
      } else {
        initJCZList();
        messageApi.success(message);
      }
    });
    setPrintCallback((detailData: any) => {
      setDetailData(detailData);
      setShowFee(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, jczFilter]);

  useEffect(() => {
    setPageNum(parseInt(searchParams.get("pageNum") || "1"));
    setPageSize(parseInt(searchParams.get("pageSize") || "5"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = useCallback((value: JCZFilter, initPageSize: boolean) => {
    setJCZFilter(value);
    if (initPageSize) {
      setPageNum(1);
    }
  }, []);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [showFee, setShowFee] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<JCZDataType>({ jczNo: "" });

  const printFee = () => {
    reactToPrintFn();
  };

  return (
    <main className={styles.userWrap}>
      <div className={styles.content}>
        {messageContextHolder}
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
      <Modal
        title="打印缴费单"
        open={showFee}
        onOk={() => {
          setShowFee(false);
          printFee();
        }}
        onCancel={() => {
          setShowFee(false);
        }}
        width={650}
      >
        <PrintContent ref={contentRef} data={detailData} />
      </Modal>
    </main>
  );
}
