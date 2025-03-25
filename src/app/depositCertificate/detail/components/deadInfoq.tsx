"use client";
import { XRDataType } from "@/utils/types";
import { Form, Input, Table, TableProps, theme } from "antd";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: XRDataType;
  index: number;
}
export default function DeadInfo1({
  list,
  xrIsRevise,
}: {
  list: XRDataType[] | undefined;
  xrIsRevise: boolean;
}) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

    return (
      <td {...restProps}>
        {xrIsRevise ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const columns = [
    {
      title: "先人姓名",
      dataIndex: "xrName",
      key: "xrName",
    },
    {
      title: "迁入日期",
      dataIndex: "created",
      key: "created",
    },
  ];
  const mergedColumns: TableProps<XRDataType>["columns"] = columns.map(
    (col) => {
      return {
        ...col,
        onCell: (record: XRDataType) => ({
          record,
          inputType: col.dataIndex === "created" ? "text" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    }
  );
  return (
    <main style={{ height: "100%" }}>
      <div style={listStyle}>
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            columns={mergedColumns}
            dataSource={list}
            scroll={{ y: "100%" }}
            components={{
              body: { cell: EditableCell },
            }}
          />
        </Form>
      </div>
    </main>
  );
}
