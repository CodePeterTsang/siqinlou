"use client";
import {
  useRoomList,
  useSetRoomList,
  useGeList,
  useSetGeList,
} from "@/utils/store/useConfigStore";
import {
  Flex,
  Form,
  FormProps,
  Input,
  InputRef,
  Select,
  RefSelectProps,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { caTypeMap } from "@/utils/types";
type FieldType = {
  roomNo?: string;
  caNo?: string;
  caType?: string;
};
export default function Position({
  cb,
  print,
  caType,
  isNewJcz,
}: {
  cb: ({ roomNo, caNo }: { roomNo: string; caNo: string }) => void;
  print: () => void;
  caType: 1 | 2 | 3 | 4 | undefined;
  isNewJcz: boolean;
}) {
  const roomList = useRoomList();
  const setRoomList = useSetRoomList();
  const geList = useGeList();
  const setGeList = useSetGeList();
  const [detailQuery, setDetailQuery] = useState({ roomNo: "", caNo: "" });
  const geRef = useRef<RefSelectProps>(null);
  // const form = Form.useFormInstance();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const onRoomChange = (value: string) => {
    setGeList(value, isNewJcz ? 0 : 1);
    setDetailQuery({
      ...detailQuery,
      roomNo: value,
    });
  };

  const onGeChange = (value: string) => {
    setDetailQuery({
      ...detailQuery,
      caNo: value,
    });
    cb({
      ...detailQuery,
      caNo: value,
    });
  };

  useEffect(() => {
    setRoomList();
  }, [setRoomList]);

  useEffect(() => {
    form.setFieldValue("caType", caType ? caTypeMap[caType] : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caType]);

  useEffect(() => {
    form.setFieldsValue({ roomNo: "", caNo: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewJcz]);

  return (
    <main style={{ height: "100%" }}>
      <Form
        name="basic"
        labelAlign="left"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
        form={form}
      >
        <Form.Item<FieldType> label="寄存室" name="roomNo">
          <Select
            showSearch
            placeholder="寄存室"
            optionFilterProp="label"
            onChange={onRoomChange}
            autoFocus
            onSelect={() => {
              geRef.current?.focus();
            }}
            options={roomList}
          />
        </Form.Item>
        <Form.Item<FieldType> label="寄存格" name="caNo">
          <Select
            showSearch
            placeholder="寄存格"
            optionFilterProp="label"
            onChange={onGeChange}
            onKeyUp={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                if (!isNewJcz) {
                  print();
                }
              }
            }}
            ref={geRef}
            options={geList}
          />
        </Form.Item>
        <Form.Item<FieldType> label="格类型" name="caType">
          <Input disabled placeholder="格类型" variant="borderless" />
        </Form.Item>
      </Form>
    </main>
  );
}
