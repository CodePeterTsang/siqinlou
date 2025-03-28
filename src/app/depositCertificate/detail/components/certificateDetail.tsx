"use client";
import { Flex, Form, FormProps, Input, Table, TableProps, theme } from "antd";
import { useEffect } from "react";
type FieldType = {
  jczNo?: string;
  created?: string;
  jfEndYear?: string;
  jfStatus: number;
};
export default function CertificateDetail({
  jczNo,
  created,
  jfEndYear,
  jfStatus,
}: {
  jczNo: string | undefined;
  created: string | undefined;
  jfEndYear: string | undefined;
  jfStatus: boolean | undefined;
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
    form.setFieldsValue({
      jczNo,
      created,
      jfEndYear,
      jfStatus: jfStatus === undefined ? "" : jfStatus ? "正常" : "欠费",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jczNo, jfEndYear]);

  return (
    <main>
      <Form
        name="certificateDetail"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        layout="inline"
        wrapperCol={{
          span: 12,
        }}
      >
        {/* <Flex gap="small" wrap>
       
        </Flex> */}
        <Form.Item<FieldType> label="寄存证编号" name="jczNo">
          <Input disabled placeholder="寄存证编号" variant="borderless" />
        </Form.Item>
        <Form.Item<FieldType> label="开户日期" name="created">
          <Input disabled placeholder="开户日期" variant="borderless" />
        </Form.Item>
        <Form.Item<FieldType> label="缴费止年限" name="jfEndYear">
          <Input disabled placeholder="缴费止年限" variant="borderless" />
        </Form.Item>
        <Form.Item<FieldType> label="缴费状态" name="jfStatus">
          <Input disabled placeholder="缴费状态" variant="borderless" />
        </Form.Item>
      </Form>
    </main>
  );
}
