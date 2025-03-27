"use client";
import { Button, Col, Form, Input, Row, Select, Space, theme } from "antd";
// import { useState } from "react";
// import { DownOutlined } from "@ant-design/icons";

import { useRoomList } from "@/utils/store/useConfigStore";
import { JCZFilter } from "@/utils/types";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const AdvancedSearchForm = ({
  onFilter,
}: {
  onFilter: (values: JCZFilter, initPageSize: boolean) => void;
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const roomList = useRoomList();
  const searchParams = useSearchParams();

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
      placeholder: "请填写格号",
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
      label: "寄存证编号",
      key: "jczNo",

      placeholder: "请选择格状态",
      type: "input",
    },

    {
      label: "先人名称",
      key: "xrName",

      placeholder: "请填写先人名称",
      type: "input",
    },
    {
      label: "委办人名称",
      key: "wbrName",
      placeholder: "请填写委办人名称",
      type: "input",
    },
    {
      label: "注销状态",
      key: "status",
      placeholder: "请选择注销状态",
      options: [
        {
          value: 0,
          label: "否",
        },
        {
          value: 1,
          label: "是",
        },
      ],
    },
    {
      label: "缴费状态",
      key: "caStatus",
      placeholder: "请选择缴费状态",
      options: [
        {
          value: 0,
          label: "正常",
        },
        {
          value: 1,
          label: "欠费",
        },
      ],
    },
  ];
  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };
  useEffect(() => {
    const filterValue = JSON.parse(searchParams.get("jczFilter") || "");
    form.setFieldsValue(filterValue);
    onFilter(filterValue, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   onFilter({}, true);
  // }, [onFilter]);

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={(value) => {
        onFilter(value, true);
      }}
    >
      <Row gutter={24}>
        {searchLabels.map((item, index) => (
          // <div key={index}>{item}</div>
          <Col span={8} key={index}>
            <Form.Item
              name={searchLabels[index].key}
              label={searchLabels[index].label}
            >
              {searchLabels[index].type === "input" ? (
                <Input placeholder={searchLabels[index].placeholder} />
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
