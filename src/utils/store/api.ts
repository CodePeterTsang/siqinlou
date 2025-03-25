import req from "@/utils/req";

interface Sg {
  roomNo: string;
  caNo: string;
}

interface SgListQuery {
  roomNo?: string;
  caNo?: number;
  caType?: number;
  caStatus?: number;
  pageSize?: number;
  pageNum?: number;
}

interface RoomListQuery {
  roomNo: string;
}

export const sgListApi = (query: SgListQuery) =>
  req.post("/api/ca/query", query);

export const roomListApi = (query: RoomListQuery) =>
  req.post("/api/room/query", query);
