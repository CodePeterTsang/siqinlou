"use client";
import { Flex, Form, FormProps, Input, DatePicker, theme } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
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
  isNewJcz,
  valuesChangeCb,
}: {
  jczNo: string | undefined;
  created: string | undefined;
  jfEndYear: string | undefined;
  jfStatus: boolean | undefined;
  isNewJcz: boolean;
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
    // 如果 created 是 dayjs 对象，格式化为 YYYY-MM-DD 字符串再回传
    const formatted = {
      ...allValues,
      created: allValues.created
        ? dayjs(allValues.created).format("YYYY-MM-DD")
        : undefined,
    } as FieldType;

    valuesChangeCb(formatted);
  };

  useEffect(() => {
    form.setFieldsValue({
      jczNo,
      // 将字符串日期转换为 dayjs 对象以供 DatePicker 显示
      created: created ? dayjs(created) : undefined,
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
        onValuesChange={onValuesChange}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        layout="inline"
        wrapperCol={{
          span: 15,
        }}
      >
        <Form.Item<FieldType> label="寄存证编号" name="jczNo">
          <Input disabled placeholder="寄存证编号" variant="borderless" />
        </Form.Item>
        <Form.Item<FieldType> label="开户日期" name="created">
          <DatePicker
            disabled={!isNewJcz}
            format="YYYY-MM-DD"
            placeholder="开户日期"
          />
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
