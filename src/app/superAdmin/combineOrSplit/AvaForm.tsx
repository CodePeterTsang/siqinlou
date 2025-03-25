"use client";
import { useRoomList } from "@/utils/store/useConfigStore";
import { RoomFilter } from "@/utils/types";
import { Button, Col, Form, Input, Row, Select, Space, theme } from "antd";
// import { useState } from "react";
// import { DownOutlined } from "@ant-design/icons";

// const { Option } = Select;

const searchLabels = ["室号"];

const AdvancedSearchForm = ({
  onFilter,
}: {
  onFilter: (values: RoomFilter) => void;
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  // const [expand, setExpand] = useState(false);
  const roomList = useRoomList();

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values: any) => {
    onFilter(values);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
      initialValues={{ roomNo: "A101" }}
    >
      <Row gutter={24}>
        {searchLabels.map((item, index) => (
          <Col span={8} key={index}>
            <Form.Item name="roomNo" label={searchLabels[index]}>
              <Select
                showSearch
                placeholder="请选择室号"
                optionFilterProp="label"
                options={roomList}
              ></Select>
            </Form.Item>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "right" }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default AdvancedSearchForm;
