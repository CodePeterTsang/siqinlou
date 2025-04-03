import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { XRDataType } from "@/utils/types";
import dayjs from "dayjs";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "dateRange" | "text";
  record: XRDataType;
  index: number;
}

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
  const inputNode =
    inputType === "dateRange" ? (
      <DatePicker format={"YYYY-MM-DD"} maxDate={dayjs()} />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function DeadInfo({
  list,
  valuesChangeCb,
  outsideBox,
  outsideSelected,
  isNewJcz,
}: {
  list: XRDataType[] | undefined;
  valuesChangeCb: (value: XRDataType[]) => void;
  outsideBox: boolean;
  outsideSelected: ({ xrName }: { xrName: string }) => void;
  isNewJcz: boolean;
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState<XRDataType[] | undefined>(list);
  const [editingKey, setEditingKey] = useState<number>(0);

  const isEditing = (record: XRDataType) => record.id === editingKey;

  const rowSelection: TableProps<XRDataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: XRDataType[]) => {
      outsideSelected({
        xrName: selectedRows[0].xrName,
      });
    },
    type: "radio",
  };
  const edit = (record: Partial<XRDataType> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      created: dayjs(record.created),
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as XRDataType;

      const updateRow = {
        ...row,
        created: dayjs(row.created).format("YYYY-MM-DD"),
      };
      const newData = [...(data as XRDataType[])];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          oriName: item.xrName,
          ...updateRow,
        });
        setData(newData);
        setEditingKey(0);
      } else {
        newData.push(updateRow);
        setData(newData);
        setEditingKey(0);
      }
      valuesChangeCb(newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "先人姓名",
      dataIndex: "xrName",
      key: "xrName",
      editable: true,
    },
    {
      title: "迁入日期",
      dataIndex: "created",
      key: "created",
      editable: true,
    },

    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: XRDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginInlineEnd: 8 }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="确定取消吗?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== 0}
            onClick={() => edit(record)}
          >
            编辑
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns: TableProps<XRDataType>["columns"] = columns.map(
    (col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: XRDataType) => ({
          record,
          inputType: col.dataIndex === "created" ? "dateRange" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }
  );

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <Form form={form} component={false}>
      {outsideBox ? (
        <Table<XRDataType>
          rowKey="id"
          components={{
            body: { cell: EditableCell },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
          rowSelection={rowSelection}
        />
      ) : (
        <Table<XRDataType>
          rowKey="id"
          components={{
            body: { cell: EditableCell },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
        />
      )}
    </Form>
  );
}
