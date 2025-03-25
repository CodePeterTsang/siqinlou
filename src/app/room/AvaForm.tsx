"use client";
import { Button, Col, Form, Input, Row, Select, Space, theme } from "antd";
// import { useState } from "react";
// import { DownOutlined } from "@ant-design/icons";
import { useRoomList } from "@/utils/store/useConfigStore";
import { RoomFilter } from "@/utils/types";
import { useEffect } from "react";

const AdvancedSearchForm = ({
  onFilter,
}: {
  onFilter: (values: RoomFilter) => void;
}) => {
  const roomList = useRoomList();

  const searchLabels = [
    {
      label: "室号",
      key: "roomNo",
      options: roomList,
      placeholder: "请选择室号",
    },
    {
      label: "格号",
      key: "caNo",
      placeholder: "请选择格号",
      type: "input",
    },
    {
      label: "格类型",
      key: "caType",
      options: [
        { value: 1, label: "单格" },
        { value: 2, label: "双格" },
        { value: 3, label: "三格" },
        { value: 4, label: "四格" },
      ],
      placeholder: "请选择格类型",
    },
    {
      label: "格状态",
      key: "caStatus",
      options: [
        { value: 0, label: "空" },
        { value: 1, label: "存放" },
      ],
      placeholder: "请选择格状态",
    },
  ];
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  // const [expand, setExpand] = useState(false);

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  useEffect(() => {
    onFilter({ roomNo: "A101" });
  }, [onFilter]);

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={(value) => {
        onFilter(value);
      }}
      initialValues={{ roomNo: "A101" }}
    >
      <Row gutter={24}>
        {searchLabels.map((item, index) => (
          <Col span={8} key={index}>
            <Form.Item
              name={searchLabels[index].key}
              label={searchLabels[index].label}
            >
              {searchLabels[index].type === "input" ? (
                <Input />
              ) : (
                <Select
                  showSearch
                  placeholder={searchLabels[index].placeholder}
                  optionFilterProp="label"
                  options={searchLabels[index].options}
                ></Select>
              )}
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
