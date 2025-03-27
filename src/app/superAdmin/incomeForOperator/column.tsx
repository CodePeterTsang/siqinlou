import { Space, type TableProps } from "antd";

export interface IncomeForTimeDataType {
  key: string;
  time: string;
  income: number;
  operator: string;
}

const data: IncomeForTimeDataType[] = [];

export { data };
