"use client";
import { Button, Col, Form, Input, Row, Space, theme, DatePicker } from "antd";
import dayjs from "dayjs";

import { useState } from "react";

const searchLabels = ["时间范围"];
const { RangePicker } = DatePicker;

const AdvancedSearchForm = ({ cb }: { cb: (value: any[]) => void }) => {
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
    cb(values.field);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8} key={1}>
          <Form.Item name={`field`} label={searchLabels[0]}>
            <RangePicker picker="month" maxDate={dayjs()} />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: "right" }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          {/* <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            清空
          </Button> */}
        </Space>
      </div>
    </Form>
  );
};

export default AdvancedSearchForm;
