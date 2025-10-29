"use client";
import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  theme,
} from "antd";
// import { useState } from "react";
// import { DownOutlined } from "@ant-design/icons";

import { useRoomList } from "@/utils/store/useConfigStore";
import { JCZFilter } from "@/utils/types";
import { useEffect, useState } from "react";
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

  const [showQfSearch, setShowQfSearch] = useState<boolean>(false);

  const searchLabels: any[] = [
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
      label: "欠费状态",
      key: "status",
      placeholder: "请选择注销状态",
      options: [
        {
          value: 0,
          label: "正常",
        },
        {
          value: 2,
          label: "欠费迁出",
        },
        {
          value: 3,
          label: "清缴",
        },
      ],
    },
    // {
    //   label: "缴费状态",
    //   key: "jfStatus",
    //   placeholder: "请选择缴费状态",
    //   options: [
    //     {
    //       value: true,
    //       label: "正常",
    //     },
    //     {
    //       value: false,
    //       label: "欠费",
    //     },
    //   ],
    // },
  ];
  const qFSearchLabels: any[] = [
    {
      label: "欠费类型",
      key: "qfType",
      options: [
        { value: ">=", label: ">=" },
        { value: ">", label: ">" },
        { value: "=", label: "=" },
        { value: "<=", label: "<=" },
        { value: "<", label: "<" },
      ],
      placeholder: "请选择格类型",
    },
    {
      label: "欠费年数",
      key: "qfYear",
      placeholder: "请输入年数",
      type: "input",
    },
  ];
  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onValuesChange: FormProps<JCZFilter>["onValuesChange"] = (
    values,
    allValues
  ) => {
    const { jfStatus } = allValues;
    setShowQfSearch(!jfStatus);
  };

  useEffect(() => {
    const jczFilterJson = searchParams.get("jczFilter");
    let filterValue = {};

    if (jczFilterJson) {
      filterValue = JSON.parse(jczFilterJson);
    }
    form.setFieldsValue(filterValue);
    setShowQfSearch(!form.getFieldValue("jfStatus"));

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
      onValuesChange={onValuesChange}
    >
      <Row gutter={24}>
        {searchLabels.map((item, index) => (
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
        {showQfSearch
          ? qFSearchLabels.map((item, index) => (
              <Col span={8} key={index}>
                <Form.Item
                  name={qFSearchLabels[index].key}
                  label={qFSearchLabels[index].label}
                >
                  {qFSearchLabels[index].type === "input" ? (
                    <InputNumber
                      placeholder={qFSearchLabels[index].placeholder}
                      min={1}
                      max={99}
                    />
                  ) : (
                    <Select
                      showSearch
                      placeholder={qFSearchLabels[index].placeholder}
                      optionFilterProp="label"
                      options={qFSearchLabels[index].options}
                    ></Select>
                  )}
                </Form.Item>
              </Col>
            ))
          : ""}
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
