"use client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
  theme,
} from "antd";
import { editManagerApi, managerApi, maxYearApi, setFeeLimitApi } from "../api";
import { message } from "antd";
import { useEffect } from "react";
export default function User() {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    try {
      await editManagerApi({ manager: values.manager });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function getYear() {
      const { data } = await managerApi();
      form.setFieldsValue({ manager: data });
    }
    getYear();
  }, [form]);

  return (
    <main>
      {contextHolder}
      <div>
        <Form
          form={form}
          name="advanced_search"
          style={formStyle}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={16} key={1}>
              <Form.Item
                name="manager"
                label="设置收款人"
                rules={[
                  {
                    required: true,
                    message: "请输入收款人",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <Space size="small">
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </main>
  );
}
