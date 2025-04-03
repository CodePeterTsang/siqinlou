"use client";
import { Flex, Form, FormProps, Input, Table, TableProps, theme } from "antd";
import TextArea from "antd/es/input/TextArea";
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
  caNo,
  valuesChangeCb,
}: {
  wbrName: string | undefined;
  wbrId: string | undefined;
  phoneNum: string | undefined;
  address: string | undefined;
  wbrDesc: string | undefined;
  agentIsRevise: boolean;
  caNo: string | undefined;
  valuesChangeCb: (value: FieldType) => void;
}) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const onValuesChange: FormProps<FieldType>["onValuesChange"] = (
    values,
    allValues
  ) => {
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

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        const activeElementId = document.activeElement?.id;
        // 新增寄存证
        if (agentIsRevise && caNo) {
          switch (activeElementId) {
            case "basic_caNo":
              form.focusField("wbrName");
              break;
            case "agent_wbrName":
              form.focusField("wbrId");
              break;
            case "agent_wbrId":
              form.focusField("phoneNum");
              break;
            case "agent_phoneNum":
              form.focusField("address");
              break;
            case "agent_address":
              form.focusField("wbrDesc");
              break;
            default:
              break;
          }
        }
      }
    };

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [agentIsRevise, caNo]);
  return (
    <main>
      <Form
        name="agent"
        wrapperCol={{ span: 16 }}
        initialValues={{ wbrName: wbrName }}
        onValuesChange={onValuesChange}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
        form={form}
        labelAlign="left"
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
        <Form.Item<FieldType>
          label="地址"
          name="address"
          style={{ width: "100%" }}
        >
          <Input
            placeholder="地址"
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="委办人备注"
          name="wbrDesc"
          style={{ width: "100%" }}
        >
          <TextArea
            placeholder="委办人备注"
            disabled={!agentIsRevise}
            variant={agentIsRevise ? "outlined" : "borderless"}
          />
        </Form.Item>
      </Form>
    </main>
  );
}
