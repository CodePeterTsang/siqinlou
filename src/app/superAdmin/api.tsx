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

export const setFeeLimitApi = (query: { maxYear: number }) =>
  req.post("/api/jcz/edit/year", query);

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

/**
 * 查询寄存证最大年数查询
 */
export const maxYearApi = () => req.post("/api/jcz/query/year");

/**
 * 通过时间去查询缴费记录
 */
export const incomeForTimeApi = (query: {
  startTime: number;
  endTime: number;
}) => req.post("/api/jfd/count/month", query);

/**
 * 通过时间和操作员去查询缴费记录
 */
export const incomeForOperatorApi = (query: {
  startTime: number;
  endTime: number;
  operator: string;
}) => req.post("/api/jfd/count/day", query);

/**
 * 查询缴费经理
 */
export const managerApi = () => req.post("/api/jcz/query/manager");

/**
 * 设置缴费经理
 */
export const editManagerApi = (query: { manager: string }) =>
  req.post("/api/jcz/edit/manager", query);

/**
 * 设置缴费经理
 */
export const banUserApi = (query: { userNo: string; isBand: boolean }) =>
  req.post("/api/user/band", query);

export const logoutApi = (userNo: string) =>
  req.post("/api/user/logout", { userNo: userNo });
