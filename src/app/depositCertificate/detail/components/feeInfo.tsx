"use client";
import {
  Col,
  Flex,
  Form,
  FormProps,
  Input,
  InputNumber,
  Row,
  Table,
  TableProps,
  theme,
} from "antd";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface DataType {
  key: string;
  name: string;
  role: number;
  desc: string;
  tags: string[];
}
type FieldType = {
  yearRange?: string;
  yearCount?: string;
  jfCount?: string;
  jfTotal: string;
  jfType: string;
};

export default function FeeInfo({
  startYear,
  showFeeDetail,
  caType,
  feeInfoCb,
}: {
  startYear: string | undefined;
  showFeeDetail: boolean;
  caType: 1 | 2 | 3 | 4 | undefined;
  feeInfoCb: (value: number) => void;
}) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const data: DataType[] = [];

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
    if (startYear) {
      const yearRange = parseInt(startYear) + 1 + parseInt(values.yearCount);
      form.setFieldsValue({
        yearRange: `${parseInt(startYear) + 1}-${yearRange ? yearRange : 0}`,
        yearCount: values.yearCount,
        jfTotal: values.yearCount * (caType ? caType : 1) * 150,
        jfType: "寄存证年费",
        jfCount: caType,
      });
      feeInfoCb(parseInt(values.yearCount));
    }
  };

  useEffect(() => {
    if (startYear && showFeeDetail) {
      const range = dayjs().year() - (parseInt(startYear) + 1);
      form.setFieldsValue({
        yearRange: `${parseInt(startYear) + 1}-${dayjs().year()}`,
        yearCount: range,
        jfTotal: range * (caType ? caType : 1) * 150,
        jfType: "寄存证年费",
        jfCount: caType,
      });
    } else {
      form.setFieldsValue({
        yearRange: undefined,
        yearCount: undefined,
        jfTotal: undefined,
        jfType: undefined,
        jfCount: undefined,
      });
    }
  }, [showFeeDetail, startYear, caType, form]);

  return (
    <main>
      <div>
        <div>
          <Form
            name="feeInfo"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="inline"
            form={form}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={12}>
                <Form.Item<FieldType> label="缴费年限" name="yearRange">
                  <Input disabled placeholder="缴费年限" variant="borderless" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item<FieldType> label="缴费年数" name="yearCount">
                  <InputNumber
                    placeholder="缴费年数"
                    disabled={!showFeeDetail}
                    min={1}
                    max={99}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={12}>
                <Form.Item<FieldType> label="缴费合计" name="jfTotal">
                  <Input disabled placeholder="缴费合计" variant="borderless" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item<FieldType> label="缴费类型" name="jfType">
                  <Input disabled placeholder="缴费类型" variant="borderless" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item<FieldType> label="缴费数量" name="jfCount">
                  <Input disabled placeholder="缴费数量" variant="borderless" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </main>
  );
}
