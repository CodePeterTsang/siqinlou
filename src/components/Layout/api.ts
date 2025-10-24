import req from "@/utils/req";

export const logoutApi = (userNo: string) =>
  req.post("/api/user/logout", { userNo: userNo });
