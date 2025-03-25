"use client";
import {
  Form,
  Input,
  Modal,
  Space,
  Table,
  TableProps,
  theme,
  message,
  Button,
} from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import { data, UserListDataType } from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { useCallback, useEffect, useState } from "react";
import { userCreateApi, userEditApi, userListApi } from "../api";
type UserFieldType = {
  userNo?: string;
  userName?: string;
  password?: string;
  newPassword: string;
};
export default function User() {
  const { token } = theme.useToken();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [list, setList] = useState<UserListDataType[]>(data);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [editContent, setEditContent] = useState<
    UserListDataType | undefined
  >();
  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const initUserList = useCallback(
    async (value?: string) => {
      try {
        const { data } = await userListApi({ userNo: value });
        setList(data);
      } catch (e: any) {
        messageApi.error(e?.errorMessage);
      }
    },
    [messageApi]
  );

  const editUser = useCallback(async () => {
    try {
      await userEditApi({
        ...editForm.getFieldsValue(),
        userNo: editContent?.userNo,
      });
    } catch (e: any) {
      const { data } = e.response;
      if (data?.errorMessage) {
        messageApi.error(data.errorMessage);
      }
    }
  }, [editContent?.userNo, editForm, messageApi]);

  const addUser = useCallback(async () => {
    try {
      await userCreateApi({
        ...addForm.getFieldsValue(),
      });
      messageApi.success("新增用户成功");

      setIsAdd(false);
    } catch (e: any) {
      const { data } = e.response;
      if (data?.errorMessage) {
        messageApi.error(data.errorMessage);
      }
    }
  }, [addForm, messageApi]);

  const handleAdd = () => {
    setIsAdd(true);
  };

  const columns: TableProps<UserListDataType>["columns"] = [
    {
      title: "用户ID",
      dataIndex: "userNo",
      key: "userNo",
      render: (text) => <a>{text}</a>,
      fixed: "left",
      width: 100,
    },
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
      fixed: "left",
      width: 100,
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role) => (role === "admin" ? "超级管理员" : "使用者"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsEdit(true);
              setEditContent(record);
            }}
          >
            编辑
          </a>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    initUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEdit) {
      editForm.setFieldsValue({
        userName: editContent?.userName,
        password: editContent?.password,
      });
    } else {
      initUserList();
    }
  }, [editContent, isEdit, isAdd, editForm, initUserList]);

  return (
    <main className={styles.userWrap}>
      {contextHolder}
      <div className={styles.content}>
        <AvaForm
          cb={(value) => {
            initUserList(value);
          }}
        />
        <br />
        <div style={listStyle}>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            新增用户
          </Button>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 500 }}
          />
        </div>
      </div>
      <Modal
        title="编辑"
        open={isEdit}
        onOk={editUser}
        onCancel={() => {
          setIsEdit(false);
        }}
      >
        <Form
          name="editForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={editForm}
        >
          <Form.Item<UserFieldType>
            label="姓名"
            name="userName"
            rules={[{ required: true, message: "请输入名称!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserFieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<UserFieldType>
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: "请输入新密码!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新增用户"
        open={isAdd}
        onOk={addUser}
        onCancel={() => {
          setIsAdd(false);
        }}
      >
        <Form
          name="addForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={addForm}
        >
          <Form.Item<UserFieldType>
            label="用户ID"
            name="userNo"
            rules={[{ required: true, message: "请输入用户ID!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<UserFieldType>
            label="姓名"
            name="userName"
            rules={[{ required: true, message: "请输入名称!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserFieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
