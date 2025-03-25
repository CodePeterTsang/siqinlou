"use client";
import { Flex, Form, FormProps, Input, Table, TableProps, theme } from "antd";
import { DatePicker, Space } from "antd";
import TextArea from "antd/es/input/TextArea";

type FieldType = {
  wbrDesc: string;
};

export default function Note({
  wbrDesc,
  noteDisabled,
}: {
  wbrDesc: string | undefined;
  noteDisabled: boolean | undefined;
}) {
  const { token } = theme.useToken();

  const { RangePicker } = DatePicker;

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <main>
      <div>
        <Form
          name="note"
          initialValues={{ wbrDesc: wbrDesc }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
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
