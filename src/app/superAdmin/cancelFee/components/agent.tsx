"use client";
import { Flex, Form, FormProps, Input, Table, TableProps, theme } from "antd";
import { useEffect } from "react";
type FieldType = {
  wbrName?: string;
  wbrId?: string;
  address?: string;
  wbrDesc?: string;
  phoneNum?: string;
};
export default function Agent({
  wbrName,
  wbrId,
  phoneNum,
  address,
  wbrDesc,
  agentIsRevise,
  valuesChangeCb,
}: {
  wbrName: string | undefined;
  wbrId: string | undefined;
  phoneNum: string | undefined;
  address: string | undefined;
  wbrDesc: string | undefined;
  agentIsRevise: boolean;
  valuesChangeCb: (value: FieldType) => void;
}) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const onValuesChange: FormProps<FieldType>["onValuesChange"] = (
    values,
    allValues
  ) => {
    console.log("onValuesChange:", values);
    console.log("allValues:", allValues);
    valuesChangeCb(allValues);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    form.setFieldsValue({ wbrName, wbrId, phoneNum, address, wbrDesc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wbrName]);

  return (
    <main>
      <Form
        name="agent"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ wbrName: wbrName }}
        onValuesChange={onValuesChange}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
        form={form}
      >
        <Form.Item<FieldType> label="姓名" name="wbrName">
          <Input
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
            placeholder="姓名"
          />
        </Form.Item>
        <Form.Item<FieldType> label="身份证" name="wbrId">
          <Input
            placeholder="身份证"
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
          />
        </Form.Item>
        <Form.Item<FieldType> label="电话" name="phoneNum">
          <Input
            placeholder="电话"
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
          />
        </Form.Item>
        <Form.Item<FieldType> label="地址" name="address">
          <Input
            placeholder="地址"
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
          />
        </Form.Item>
        <Form.Item<FieldType> label="委办人备注" name="wbrDesc">
          <Input
            placeholder="委办人备注"
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
          />
        </Form.Item>
      </Form>
    </main>
  );
}
