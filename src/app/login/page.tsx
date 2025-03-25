"use client";
import { Button, Form, Input, message, Segmented, type FormProps } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi, registerApi } from "./api";
import { setToken, setUser } from "@/utils/auth";

import styles from "./index.module.less";
type FieldType = {
  password?: string;
  code?: string;
  userNo?: string;
};

export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
    const { userNo, password } = values;
    // 设置token过期时间
    try {
      const { data } = await loginApi(userNo, password);
      if (data) {
        setToken(data.token);
        setUser(
          JSON.stringify({
            userNo: data.userNo,
            userName: data.userName,
            role: data.role,
          })
        );
        router.push("/room");
      }
    } catch (e: any) {
      const { data } = e.response;
      if (data?.errorMessage) {
        messageApi.error(data.errorMessage);
      }
    }

    return;
  };

  return (
    <main className={styles.loginWrap}>
      {/* <div className={styles.leftBanner}>
        <h2>石溪思亲楼缴费系统</h2>
      </div> */}
      {contextHolder}
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <h1>欢迎登录 石溪思亲楼缴费系统</h1>

          <Form
            name="basic"
            className={styles.form}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 420 }}
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
            <>
              <Form.Item<FieldType>
                name="userNo"
                rules={[
                  {
                    type: "string",
                    message: "用户名不合法!",
                  },
                  {
                    required: true,
                    message: "请输入用户名",
                  },
                ]}
              >
                <Input
                  placeholder="请输入用户名"
                  size="large"
                  variant="filled"
                />
              </Form.Item>

              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入密码"
                  variant="filled"
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit" block size="large">
                  登录
                </Button>
              </Form.Item>
            </>
          </Form>
        </div>
      </div>
    </main>
  );
}
