import { Space, type TableProps } from "antd";

export interface UserListDataType {
  key: string;
  userName: string;
  userNo: string;
  role: string;
  password: string;
}

const data: UserListDataType[] = [];

export { data };
