import req from "@/utils/req";
import { RoomListQuery, Sg, SgListQuery } from "@/utils/types";

export const sgMergeApi = (type: number, sgList: Sg[]) =>
  req.post("/api/sg/merge", { type, sgList });

export const sgListApi = (query: SgListQuery) =>
  req.post("/api/ca/query", query);

export const roomListApi = (query: RoomListQuery) =>
  req.post("/api/room/query", query);
