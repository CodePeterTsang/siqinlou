"use client";
import { JfDataType, JXDataType } from "@/utils/types";
import { Table, TableProps, theme } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function FeeDetail({
  list,
  showFeeDetail,
  startYear,
  feeCount,
  caType = 1,
  xrLength = 1,
}: {
  list: JXDataType[] | undefined;
  showFeeDetail: boolean;
  startYear: string | undefined;
  feeCount: number | undefined;
  caType: 1 | 2 | 3 | 4 | undefined;
  xrLength: number | undefined;
}) {
  const { token } = theme.useToken();
  const [data, setData] = useState<JfDataType[] | undefined>([]);
  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const columns: TableProps<JfDataType>["columns"] = [
    {
      title: "年份",
      dataIndex: "startYear",
      key: "startYear",
    },
    {
      title: "份数",
      dataIndex: "jfCount",
      key: "jfCount",
    },
    {
      title: "金额",
      dataIndex: "money",
      key: "money",
    },
  ];

  useEffect(() => {
    const beginYear = (startYear && parseInt(startYear) + 1) || dayjs().year();
    if (showFeeDetail) {
      let calCount = 0;
      if (!feeCount) {
        calCount = dayjs().year() - beginYear;
      }
      try {
        const startYearCount = beginYear;
        const yearList = [];
        let count = 0;
        const unit = caType > xrLength ? caType : xrLength;

        while (count < (feeCount ? feeCount : calCount)) {
          yearList.push({
            id: count,
            money: 150 * unit,
            startYear: startYearCount + count,
            jfCount: unit,
          });
          count++;
        }
        setData(yearList);
      } catch (e) {}
    } else {
      setData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeeDetail, startYear, feeCount]);

  return (
    <main style={{ height: "100%" }}>
      <div style={listStyle}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 500 }}
        />
      </div>
    </main>
  );
}
