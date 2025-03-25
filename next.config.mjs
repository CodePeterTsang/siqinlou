import withAntdLess from "next-plugin-antd-less";

const nextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    BASE_API_URL: "http://gy.topxixi.top:58080/",
  },
};

export default withAntdLess(nextConfig);
