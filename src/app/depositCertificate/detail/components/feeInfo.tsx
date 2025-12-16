"use client";
import { Col, Form, FormProps, Input, InputNumber, Row, theme } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { JXDataType, XRDataType } from "@/utils/types";

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
  caType = 1,
  feeInfoCb,
  xrList = [],
  lastJfDetail,
}: {
  startYear: string | undefined;
  showFeeDetail: boolean;
  caType: 1 | 2 | 3 | 4 | undefined;
  feeInfoCb: (value: number) => void;
  xrList?: XRDataType[];
  lastJfDetail?: JXDataType;
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
    const beginYear = startYear ? parseInt(startYear) + 1 : dayjs().year();
    const yearRange = beginYear + parseInt(values.yearCount) - 1;
    const xrLength = xrList ? xrList.length : 0;
    const unit = caType > xrLength ? caType : xrLength;
    form.setFieldsValue({
      yearRange: `${beginYear}-${yearRange}`,
      jfTotal: values.yearCount * unit * 150,
      jfType: "寄存证年费",
      jfCount: unit,
    });
    feeInfoCb(parseInt(values.yearCount));
  };

  useEffect(() => {
    if (showFeeDetail) {
      // 上一次缴费人数
      const lastJfCount = lastJfDetail ? parseInt(lastJfDetail.jfCount) : 0;
      const xrLength = xrList ? xrList.length : 0;
      const lastXr =
        xrList && xrList.length > 0 ? xrList[xrList.length - 1] : null;

      // 上一次缴费人数跟本次寄存人数差值，如果存在差值，即算是新迁入，需要先缴清差值部分
      const xrLengthAndLastJfCountDiff =
        xrLength && xrLength - lastJfCount > 0 ? xrLength - lastJfCount : 0;
      if (xrLengthAndLastJfCountDiff > 0) {
        const beginYear = new Date(lastXr ? lastXr.created : "").getFullYear();
        const endYear = startYear ? parseInt(startYear) : dayjs().year();
        const yearCount = endYear - beginYear + 1;
        const unit =
          caType > xrLengthAndLastJfCountDiff
            ? caType
            : xrLengthAndLastJfCountDiff;
        form.setFieldsValue({
          yearRange: `${beginYear}-${endYear}`,
          yearCount: yearCount,
          jfTotal: unit * 150 * yearCount,
          jfType: "寄存证年费",
          jfCount: unit,
        });
        feeInfoCb(yearCount);
        return;
      }
      const beginYear = startYear ? parseInt(startYear) + 1 : dayjs().year();

      const unit = caType > xrLength ? caType : xrLength;

      let range = 1;
      if (beginYear <= dayjs().year()) {
        range = startYear ? dayjs().year() - beginYear : 4;
      }
      form.setFieldsValue({
        yearRange: `${beginYear}-${beginYear + range}`,
        yearCount: range + 1,
        jfTotal: (range + 1) * unit * 150,
        jfType: "寄存证年费",
        jfCount: unit,
      });
      feeInfoCb(range + 1);
    } else {
      form.setFieldsValue({
        yearRange: undefined,
        yearCount: undefined,
        jfTotal: undefined,
        jfType: undefined,
        jfCount: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeeDetail, startYear, caType, xrList]);

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
