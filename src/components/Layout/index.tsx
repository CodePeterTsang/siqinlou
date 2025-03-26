"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  ConfigProvider,
  Badge,
  type MenuProps,
} from "antd";
import getNavList from "./menu";
import { useRouter } from "next/navigation";
import {
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  // TransactionOutlined,
} from "@ant-design/icons";
import { getThemeBg } from "@/utils";
// import { Link, pathnames, usePathname } from "../../navigation";
import styles from "./index.module.less";
import { getUser, removeToken, removeUser } from "@/utils/auth";
import { usePathname } from "next/navigation";
import zhCN from "antd/es/locale/zh_CN";
import { logoutApi } from "@/app/login/api";
import dynamic from "next/dynamic";
const NoSSR = (props: any) => <React.Fragment>{props.children}</React.Fragment>;
const DynamicSidebarWithNoSSR = dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  children: React.ReactNode;
  defaultOpen?: string[];
}

const CommonLayout: React.FC<IProps> = ({
  children,
  defaultOpen = ["/depositCertificate/detail"],
}) => {
  const {
    token: { borderRadiusLG, colorTextBase, colorWarningText },
  } = theme.useToken();

  const router = useRouter();
  const pathname = usePathname();
  const navList = getNavList();

  const [userName, setUserName] = useState("");
  const [curActive, setCurActive] = useState("/");
  const handleSelect = (row: { key: string }) => {
    if (row.key.includes("http")) {
      window.open(row.key);
      return;
    }
    router.push(row.key);
  };

  const onLogout = async () => {
    const userData = getUser() || "";
    const userNo = JSON.parse(userData).userNo;
    try {
      await logoutApi(userNo);
      removeToken();
      removeUser();
      router.push("./login");
    } catch (e) {}
  };

  const items: MenuProps["items"] = [
    {
      key: "3",
      label: (
        <a target="_blank" onClick={onLogout} rel="noopener noreferrer">
          退出登录
        </a>
      ),
    },
  ];

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.userName);
    }
    setCurActive(pathname);
  }, [pathname]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        components: {
          Menu: {
            itemActiveBg: "#1677ff",
            itemSelectedBg: "#1677ff",
            itemSelectedColor: "#fff",
          },
          Layout: {
            bodyBg: "#d2dcf1",
          },
        },
      }}
    >
      {pathname === "/login" ? (
        <>{children}</>
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            theme="light"
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {}}
            onCollapse={(collapsed, type) => {}}
          >
            <span className={styles.logo} style={getThemeBg(false)}>
              石溪思亲楼
            </span>
            <DynamicSidebarWithNoSSR>
              <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[curActive]}
                items={navList}
                selectedKeys={[curActive]}
                defaultOpenKeys={defaultOpen}
                onSelect={handleSelect}
              />
            </DynamicSidebarWithNoSSR>
          </Sider>
          <Layout>
            <Header
              style={{ padding: 0, ...getThemeBg(false), display: "flex" }}
            >
              <div className={styles.rightControl}>
                <div className={styles.avatar}>
                  <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                    <Avatar
                      style={{ color: "#fff", backgroundColor: "#1677ff" }}
                    >
                      {userName}
                    </Avatar>
                  </Dropdown>
                </div>
              </div>
            </Header>
            <Content style={{ margin: "24px 16px 0" }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 520,
                  ...getThemeBg(false),
                  borderRadius: borderRadiusLG,
                }}
              >
                {children}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}></Footer>
          </Layout>
        </Layout>
      )}
    </ConfigProvider>
  );
};

export default CommonLayout;
