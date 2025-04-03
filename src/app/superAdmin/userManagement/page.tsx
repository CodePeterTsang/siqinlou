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
  Select,
} from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import { data, UserListDataType } from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { useCallback, useEffect, useState } from "react";
import { banUserApi, userCreateApi, userEditApi, userListApi } from "../api";
import { logoutApi } from "@/app/login/api";
import router from "next/router";
type UserFieldType = {
  userNo?: string;
  userName?: string;
  password?: string;
  newPassword: string;
  role: string;
};
export default function User() {
  const { token } = theme.useToken();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
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
      await editForm.validateFields();
    } catch (e) {
      return;
    }
    try {
      await userEditApi({
        ...editForm.getFieldsValue(),
        userNo: editContent?.userNo,
      });
      setIsEdit(false);
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
  }, [editContent?.userNo, editForm, messageApi]);

  const addUser = useCallback(async () => {
    try {
      await addForm.validateFields();
    } catch (e) {
      return;
    }
    try {
      await userCreateApi({
        ...addForm.getFieldsValue(),
      });
      messageApi.success("新增用户成功");

      setIsAdd(false);
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
  }, [addForm, messageApi]);

  const handleAdd = () => {
    setIsAdd(true);
  };

  const onLogout = async (userNo: string) => {
    try {
      await logoutApi(userNo);
      messageApi.success("解除登录成功");
      initUserList();
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
  };
  const banUser = async (userNo: string, isBand: boolean) => {
    try {
      await banUserApi({ userNo, isBand });
      messageApi.success(isBand ? "已禁用" : "已启用");
      initUserList();
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
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
      render: (role) => (role === "admin" ? "超级管理员" : "操作员"),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (record.userNo === "admin") {
          return "";
        }
        switch (status) {
          case 0:
            return <>离线中</>;
          case 1:
            return <>在线中</>;
          case 2:
            return <>禁用</>;
        }
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <div>
          <Space size="middle">
            <a
              onClick={() => {
                setIsEdit(true);
                setEditContent(record);
              }}
            >
              编辑
            </a>

            {record.userNo !== "admin" ? (
              record.status === 2 ? (
                <a
                  onClick={() => {
                    banUser(record.userNo, false);
                  }}
                >
                  启用
                </a>
              ) : record.status === 1 ? (
                <a
                  onClick={() => {
                    onLogout(record.userNo);
                  }}
                >
                  解除登录
                </a>
              ) : (
                <a
                  onClick={() => {
                    banUser(record.userNo, true);
                  }}
                >
                  禁用
                </a>
              )
            ) : (
              ""
            )}
          </Space>
        </div>
      ),
    },
  ];

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPageNum(page);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    initUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAdd || isEdit) {
      initUserList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd, isEdit]);

  useEffect(() => {
    if (isEdit) {
      editForm.setFieldsValue({
        userName: editContent?.userName,
        password: editContent?.password,
        role: editContent?.role,
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
            pagination={{
              pageSize: pageSize,
              current: pageNum,
              onChange: onPaginationChange,
              total,
            }}
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

          {/* <Form.Item<UserFieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item> */}

          <Form.Item<UserFieldType> label="新密码" name="newPassword">
            <Input.Password />
          </Form.Item>
          <Form.Item<UserFieldType>
            label="权限"
            name="role"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Select
              showSearch
              placeholder="请选择权限"
              optionFilterProp="label"
              options={[
                {
                  value: "admin",
                  label: "管理员",
                },
                {
                  value: "operator",
                  label: "操作员",
                },
              ]}
            ></Select>
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

          <Form.Item<UserFieldType>
            label="权限"
            name="role"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Select
              showSearch
              placeholder="请选择权限"
              optionFilterProp="label"
              options={[
                {
                  value: "admin",
                  label: "管理员",
                },
                {
                  value: "operator",
                  label: "操作员",
                },
              ]}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
