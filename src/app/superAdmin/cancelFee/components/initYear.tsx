"use client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
  theme,
} from "antd";
import dayjs from "dayjs";

export default function InitYear({
  disabled,
  cb,
}: {
  disabled: boolean;
  cb: (year: string) => void;
}) {
  const { token } = theme.useToken();

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

  const onFinish = (values: any) => {
    cb(dayjs(values.field).format("YYYY"));
  };

  return (
    <main>
      <div>
        <Form
          form={form}
          name="advanced_search"
          style={formStyle}
          onFinish={onFinish}
        >
          <Row>
            <Col key={1}>
              <Form.Item
                name={`field`}
                label="设置初始化年限"
                rules={[
                  {
                    required: true,
                    message: "请输入初始化年限",
                  },
                ]}
              >
                <DatePicker
                  picker="year"
                  maxDate={dayjs()}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <Space size="small">
              <Button type="primary" htmlType="submit" disabled={disabled}>
                确定
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </main>
  );
}
