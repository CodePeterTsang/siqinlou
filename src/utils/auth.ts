import Cookies from "js-cookie";

const TokenKey = "SHIXI_TOKEN";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token, { path: "/", expires: 3 });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

const UserKey = "SHIXI_USER";

export function getUser() {
  return Cookies.get(UserKey);
}

export function setUser(token: string) {
  return Cookies.set(UserKey, token, { path: "/", expires: 3 });
}

export function removeUser() {
  return Cookies.remove(UserKey);
}
