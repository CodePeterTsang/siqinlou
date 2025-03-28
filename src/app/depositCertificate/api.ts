import req from "@/utils/req";
import { XRDataType } from "@/utils/types";

interface Sg {
  roomNo: string;
  caNo: string;
}

interface SgListQuery {
  roomNo: string;
  caNo?: string;
  caType?: number;
  caStatus?: number;
  pageSize: number;
  pageNum: number;
}

interface RoomListQuery {
  roomNo: string;
  pageSize: number;
  pageNum: number;
}

interface JczQuery {
  roomNo?: string;
  caNo?: string;
  caType?: number;
  caStatus?: number;
  xrName?: string;
  wbrName?: string;
  jfStatus?: boolean;
  isFuzzy?: boolean;
}

interface JczEditQuery {
  jczNo: string;
  address?: string;
  wbrName?: string;
  xrList?: Partial<XRDataType>[];
  isDiscount?: 1 | 0;
  phoneNum?: string;
  wbrDesc?: string;
  wbrId?: string;
  jczDesc?: string;
}

interface OutsideBoxQuery {
  jczNo: string;
  xrName: string;
}

interface JczCreateQuery extends JczEditQuery {
  operator: string;
}

interface JfPay {
  operator: string;
  yearCount?: string;
  startYear?: string;
  endYear: string;
  money: string;
  jfCount: string;
  jczNo: string;
  manager: string;
}
export const sgMergeApi = (type: number, sgList: Sg[]) =>
  req.post("/api/sg/merge", { type, sgList });

export const sgListApi = (query: SgListQuery) =>
  req.post("/api/sg/query", query);

export const roomListApi = (query: RoomListQuery) =>
  req.post("/api/room/query", query);

export const jczApi = (query: JczQuery) => req.post("/api/jcz/query", query);

export const jczEdit = (query: JczEditQuery) =>
  req.post("/api/jcz/edit", query);

export const createJczNo = () => req.post("/api/jcz/max");

export const outsideBoxApi = (query: OutsideBoxQuery) =>
  req.post("/api/urn/out", query);

export const createJczApi = (query: JczCreateQuery) =>
  req.post("/api/jcz/create", query);

export const jfdPayApi = (query: JfPay) => req.post("/api/jfd/pay", query);

export const cancelJczApi = (query: { jczNo: string; operator: string }) =>
  req.post("/api/jcz/cancel", query);
