export type RoomFilter = {
  caNo?: string;
  caStatus?: 0 | 1;
  caType?: number;
  roomNo: string;
};

export interface Sg {
  roomNo: string;
  caNo: string;
}

export interface SgListQuery {
  roomNo?: string;
  caNo?: string;
  caType?: number;
  caStatus?: 0 | 1;
  pageSize?: number;
  pageNum?: number;
}

export interface RoomListQuery {
  caNo?: string;
  caStatus?: 0 | 1;
  caType?: number;
  roomNo: string;
  pageSize: number;
  pageNum: number;
}

export interface RoomListDataType {
  roomNo: number;
  caNo: number;
  caStatus: number;
  caType: number;
  id: number;
}

export type JCZFilter = {
  caNo?: string;
  caStatus?: 0 | 1;
  caType?: number;
  roomNo?: string;
  xrName?: string;
  wbrName?: string;
  jfStatus?: boolean;
  qfType?: string;
  qfYear?: string;
};

export interface XRDataType {
  id: number;
  xrName: string;
  created: string;
  oriName?: string;
}

export interface JCZDataType {
  id?: string;
  jczNo: string;
  roomNo?: string;
  caNo?: string;
  caType?: 1 | 2 | 3 | 4;
  created?: string;
  jfEndYear?: string;
  isDiscount?: 0 | 1;
  wbrName?: string;
  phoneNum?: string;
  address?: string;
  wbrDesc?: string;
  wbrId?: string;
  jczDesc?: string;
  jfStatus?: boolean;
  xrList?: XRDataType[];
  jfList?: JXDataType[];
  operator?: string;
  manager?: string;
  status?: 0 | 3 | 2; //0就证明系普通欠费，2就系已经进行咗欠费迁出，3就系清缴过
}

export const caTypeMap = {
  1: "单格",
  2: "双格",
  3: "三格",
  4: "四格",
};

export interface JXDataType {
  money: string;
  startYear: string;
  endYear?: string;
  jfCount: string;
  jfNo: string;
  created: string;
  type: string;
  fwMoney?: string;
  jcMoney?: string;
  jfDesc?: string;
  yearCount?: string;
  manager?: string;
  operator?: string;
  operatingTime?: number;
}

export interface JfDataType {
  money: number;
  startYear: number;
  endYear?: number;
  jfCount: number;
}

export interface JczQuery {
  roomNo?: string;
  caNo?: string;
  caType?: number;
  caStatus?: number;
  xrName?: string;
  wbrName?: string;
  jfStatus?: number;
  isFuzzy?: boolean;
}
