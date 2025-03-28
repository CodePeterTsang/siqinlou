"use client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
  theme,
} from "antd";
import { maxYearApi, setFeeLimitApi } from "../api";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
export default function User() {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };
  const [form] = Form.useForm();
  // const [expand, setExpand] = useState(false);

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    try {
      await setFeeLimitApi({
        maxYear: values.year.year(),
      });
      messageApi.success("缴费年限设置成功");
    } catch (e) {
      console.log(e);
      messageApi.error("缴费年限设置失败");
    }
  };

  useEffect(() => {
    async function getYear() {
      const { data } = await maxYearApi();
      form.setFieldsValue({ year: dayjs().year(data) });
    }
    getYear();
  }, [form]);

  return (
    <main>
      {contextHolder}
      <div>
        <Form
          form={form}
          name="advanced_search"
          style={formStyle}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={16} key={1}>
              <Form.Item
                name="year"
                label="设置缴费年限"
                rules={[
                  {
                    required: true,
                    message: "请输入缴费年限",
                  },
                ]}
              >
                <DatePicker picker="year" minDate={dayjs()} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <Space size="small">
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </main>
  );
}
