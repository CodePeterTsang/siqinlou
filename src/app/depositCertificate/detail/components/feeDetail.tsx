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
}: {
  list: JXDataType[] | undefined;
  showFeeDetail: boolean;
  startYear: string | undefined;
  feeCount: number | undefined;
  caType: 1 | 2 | 3 | 4 | undefined;
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
      render: (startYear, record) => `${startYear}-${record.endYear}`,
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
    if (showFeeDetail && startYear) {
      let calCount = 0;
      if (!feeCount) {
        calCount = dayjs().year() - (parseInt(startYear) + 1);
      }
      try {
        const startYearCount = parseInt(startYear) + 1;
        const yearList = [];
        let count = 0;
        while (count < (feeCount ? feeCount : calCount)) {
          yearList.push({
            id: count,
            money: 150 * caType,
            startYear: startYearCount + count,
            endYear: startYearCount + count + 1,
            jfCount: caType,
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
