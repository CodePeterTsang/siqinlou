import req from "@/utils/req";

export const loginApi = (userNo: string, password: string) =>
  req.post("/api/user/login", { userNo, password });

export const registerApi = (userNo: string, pwd: string, userName: string) =>
  req.post("/api/user/create", { userNo, pwd, userName });

export const editApi = (
  userNo: string,
  pwd: string,
  userName: string,
  newPassword: string
) => req.post("/api/user/edit", { userNo, pwd, userName, newPassword });

export const queryUserApi = (userNo: string) =>
  req.post("/api/user/query", { userNo });

export const logoutApi = (userNo: string) =>
  req.post("/api/user/logout", { userNo: userNo });
