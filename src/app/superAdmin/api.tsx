import req from "@/utils/req";
import { JczQuery, RoomListQuery, Sg, SgListQuery } from "@/utils/types";

interface Ca {
  roomNo: string;
  caNo: string;
}

interface MergeCaQuery {
  caList: Ca[];
  type: 0 | 1; // 0(拆分)/1(合并)
}

interface CancelFeeQuery {
  jczNo: string;
  operator: string;
}

interface InitYearQuery {
  jczNo: string;
  operator: string;
  initYear: string;
}

export const sgListApi = (query: SgListQuery) =>
  req.post("/api/ca/query", query);

export const sgMerge = (query: MergeCaQuery) =>
  req.post("/api/ca/merge", query);

export const setFeeLimitApi = (data: number) =>
  req.post("/api/jcz/edit/year", data);

export const jczApi = (query: JczQuery) => req.post("/api/jcz/query", query);

export const cancelFeeApi = (query: CancelFeeQuery) =>
  req.post("/api/jfd/cancel", query);

export const initYearApi = (query: InitYearQuery) =>
  req.post("/api/jfd/init", query);

export const userListApi = (query: { userNo?: string }) =>
  req.post("/api/user/query", query);

export const userEditApi = (query: {
  userNo: string;
  userName: string;
  password: string;
  newPassword: string;
}) => req.post("/api/user/edit", query);

export const userCreateApi = (query: {
  userNo: string;
  userName: string;
  password: string;
}) => req.post("/api/user/create", query);
