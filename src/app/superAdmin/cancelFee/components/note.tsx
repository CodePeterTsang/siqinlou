"use client";
import { Flex, Form, FormProps, Input, Table, TableProps, theme } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";

type FieldType = {
  wbrDesc: string;
};

export default function Note({
  jczDesc,
  noteDisabled,
}: {
  jczDesc: string | undefined;
  noteDisabled: boolean | undefined;
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
  useEffect(() => {
    form.setFieldsValue({ jczDesc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jczDesc]);

  return (
    <main>
      <div>
        <Form
          name="note"
          initialValues={{ wbrDesc: jczDesc }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<FieldType>
            label="寄存证备注"
            name="wbrDesc"
            style={{ width: "100%" }}
          >
            <TextArea
              disabled={noteDisabled}
              showCount
              maxLength={100}
              style={{ height: 100, resize: "none" }}
            />
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
