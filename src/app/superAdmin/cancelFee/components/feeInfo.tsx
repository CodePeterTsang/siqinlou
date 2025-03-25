"use client";
import { JCZDataType, JXDataType } from "@/utils/types";
import { Descriptions, DescriptionsProps } from "antd";
import { useEffect, useState } from "react";
interface FeeInfoType extends JXDataType {
  wbrName?: string;
  roomNo?: string;
  caNo?: string;
  jczNo?: string;
}
export default function FeeInfo({
  detailData,
}: {
  detailData: JCZDataType | undefined;
}) {
  const [data, setData] = useState<FeeInfoType | undefined>();
  useEffect(() => {
    if (detailData?.jfList?.length) {
      setData({
        ...detailData?.jfList[0],
        wbrName: detailData.wbrName,
        roomNo: detailData?.roomNo,
        caNo: detailData?.caNo,
        jczNo: detailData?.jczNo,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailData?.jczNo]);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "注销单号",
      children: <div>{data?.jfNo}</div>,
    },
    {
      key: "2",
      label: "缴费日期",
      children: <div>{data?.created}</div>,
    },
    {
      key: "3",
      label: "寄存位置",
      children: (
        <div>
          {data?.roomNo}室 {data?.caNo}格
        </div>
      ),
    },
    {
      key: "4",
      label: "委办人",
      children: <div>{data?.wbrName}</div>,
    },
    {
      key: "5",
      label: "缴费周期",
      children: "empty",
    },
    {
      key: "6",
      label: "缴费金额",
      children: <div>{data?.money}</div>,
    },
    {
      key: "7",
      label: "缴费类型",
      children: <div>{data?.type}</div>,
    },
  ];

  return (
    <main>
      <Descriptions layout="vertical" items={items} />
    </main>
  );
}
