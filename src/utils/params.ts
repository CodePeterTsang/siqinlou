/**
 * 将url中? 后面的参数, 变成一个json
 * @return {Object}
 * @example
 * '#hash?a=1&b=3' => {a: 1, b: 3}
 * '?a=1&b=3#hash' => {a: 1, b: 3}
 * '?a=1&b=3#hash?a=2&b=4' => {a: 2, b: 4}
 */
export function getUrlParams(sourceStr: string) {
  // 防止hash值, 影响参数名称
  let search;
  if (sourceStr) {
    // 只取最后一个?号后面的参数
    search =
      sourceStr.indexOf("?") > -1
        ? sourceStr.split("?").slice(-1).toString()
        : sourceStr;
  } else {
    // 链接中的最后一个
    search = location.search.substr(1);
    const hashSearch = location.hash.split("?")[1] || "";
    search = search ? `${search}${hashSearch && "&" + hashSearch}` : hashSearch;
  }

  // 如果没有, 则返回空对象
  if (!search) {
    return {};
  }
  const searchArr = decodeURIComponent(search).split("&");

  const urlParams: {
    [key: string]: string;
  } = {};
  urlParams._search = search;
  searchArr.forEach((str) => {
    const paramArr = str.split("=");
    // 过滤空字符串
    if (!paramArr[0]) {
      return false;
    }
    // 后面重复的参数覆盖前面的参数
    urlParams[paramArr[0]] = unescape(paramArr[1]);
  });
  return urlParams;
}
