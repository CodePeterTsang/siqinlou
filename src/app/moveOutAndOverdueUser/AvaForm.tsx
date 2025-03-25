"use client";
import { Button, Col, Form, Input, Row, Space, theme } from "antd";
// import { useState } from "react";
// import { DownOutlined } from "@ant-design/icons";

// const { Option } = Select;

const searchLabels = ["室号", "格号", "格类型", "格状态"];

const AdvancedSearchForm = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  // const [expand, setExpand] = useState(false);

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        {searchLabels.map((item, index) => (
          // <div key={index}>{item}</div>
          <Col span={8} key={index}>
            <Form.Item
              name={`field-${index}`}
              label={searchLabels[index]}
              rules={[
                {
                  required: true,
                  message: "请输入搜索内容",
                },
              ]}
            >
              <Input placeholder="关键词搜索" />
            </Form.Item>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "right" }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            清空
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default AdvancedSearchForm;
