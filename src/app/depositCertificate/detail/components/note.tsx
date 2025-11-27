"use client";
import { Flex, Form, FormProps, Input, Table, TableProps, theme } from "antd";
import { DatePicker, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";

type FieldType = {
  jczDesc: string;
};

export default function Note({
  jczDesc,
  noteDisabled,
  valuesChangeCb,
}: {
  jczDesc: string | undefined;
  noteDisabled: boolean | undefined;
  valuesChangeCb: (value: FieldType) => void;
}) {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange: FormProps<FieldType>["onValuesChange"] = (
    values,
    allValues
  ) => {
    valuesChangeCb(allValues);
  };
  useEffect(() => {
    form.setFieldsValue({ jczDesc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jczDesc]);
  return (
    <main>
      <div>
        <Form
          name="note"
          initialValues={{ jczDesc: jczDesc }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
          autoComplete="off"
          form={form}
        >
          <Form.Item<FieldType>
            label="寄存证备注"
            name="jczDesc"
            style={{ width: "100%" }}
          >
            <TextArea
              disabled={noteDisabled}
              showCount
              maxLength={300}
              style={{ height: 100, resize: "none" }}
            />
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
