import { Upload, Image, message, Card, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import styles from "./../index.module.less";
import {
  PlusOutlined,
  StarOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  queryUploadImage,
  uploadImage,
  downloadImage,
  deleteImage,
} from "../../api";
import type { UploadRequestOption } from "rc-upload/lib/interface";

export default function PictureUpload({
  jczNo,
  operator,
}: {
  jczNo: string | undefined;
  operator: string;
}) {
  useEffect(() => {
    const fetchData = async () => {
      if (jczNo) {
        const response = await queryUploadImage({ jczNo });
        const images: UploadFile[] = (response.data || []).map((img: any) => ({
          ...img,
          uid: img.id,
          name: img.name || "图片",
          status: "done",
          url: img.url,
        }));
        setFileList(images);
      } else {
        setFileList([]);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jczNo]);
  // 照片墙相关状态
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 上传前校验
  const beforeUpload = (file: File) => {
    console.log(file);
    if (fileList.length >= 5) {
      messageApi.warning("最多只能上传5张图片");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 预览处理
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 上传变更
  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    // 自动移除上传失败的图片
    const filteredList = newFileList.filter((file) => file.status !== "error");
    if (filteredList.length < newFileList.length) {
      messageApi.warning("图片上传失败");
    }
    if (filteredList.length > 5) {
      messageApi.warning("最多只能上传5张图片");
      setFileList(filteredList.slice(0, 5));
    } else {
      setFileList(filteredList);
    }
  };
  const uploadButton = <Button icon={<UploadOutlined />}>Upload</Button>;

  // 自定义上传方法
  const customRequest = async (options: UploadRequestOption<any>) => {
    if (!jczNo || !operator) {
      messageApi.error("请先选择寄存证");
      return;
    }

    const { file, onSuccess, onError, data } = options;
    try {
      // 只处理 File 或 Blob 类型
      if (file instanceof File) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadImage(formData, { jczNo, operator });
        if (res) {
          if (onSuccess) {
            onSuccess(res, file as any);
          }
        } else {
          if (onError) {
            onError(new Error("上传失败"));
          }
        }
      } else {
        if (onError) {
          onError(new Error("文件类型不支持"));
        }
      }
    } catch (err) {
      if (onError) {
        onError(new Error("上传失败"));
      }
    }
  };

  // 下载图片方法
  const handleDownload = async (file: any) => {
    console.log("download", file);
    if (!file?.id) {
      messageApi.error("图片地址不存在，无法下载");
      return;
    }
    try {
      // 调用后端下载接口，期望返回 blob 或包含可访问 url 的 data
      const res = await downloadImage({ id: file.id });

      // 尝试从响应中取出 Blob 或 URL
      let imageUrl: string | undefined;
      // 如果后端直接返回 Blob（或 response.data 是 Blob）
      if (res instanceof Blob) {
        imageUrl = URL.createObjectURL(res);
      }
      if (!imageUrl) {
        messageApi.error("图片下载失败：返回数据格式不支持");
        return;
      }

      // 将下载得到的图片显示到图片列表中（更新对应项或新增）
      setFileList((prev) => {
        const idx = prev.findIndex(
          (f: any) => (f as any).id === file.id || (f as any).uid === file.uid
        );
        const newItem: UploadFile = {
          uid: file.uid || file.id,
          name: file.name || "图片",
          status: "done",
          url: imageUrl,
          // 保留后端 id 以便后续操作
          ...(file.id ? { id: file.id } : {}),
        } as UploadFile;

        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...newItem };
          return copy;
        } else {
          return [...prev, newItem];
        }
      });
    } catch (err) {
      console.error(err);
      messageApi.error("图片下载失败");
    }
  };

  // 删除图片（点击删除图标时调用后端并从列表移除）
  const handleRemove = async (file: UploadFile) => {
    try {
      // 如果有后端 id，调用后端删除接口
      const id = (file as any).id;
      if (id) {
        const res = await deleteImage({ id, operator });
        // 可根据后端返回判断是否成功
        if (!res || (res && (res as any).errorMessage)) {
          messageApi.error("删除失败");
          return false;
        }
      }

      // 本地移除
      setFileList((prev) =>
        prev.filter((f) => (f as any).uid !== (file as any).uid)
      );
      messageApi.success("已删除");
      return true;
    } catch (err) {
      console.error(err);
      messageApi.error("删除失败");
      return false;
    }
  };

  return (
    <div className={styles["deposit-certificate-detail"]}>
      {contextHolder}
      <div>
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          maxCount={5}
          customRequest={customRequest}
          showUploadList={{
            showDownloadIcon: (file: UploadFile) => !file.url, // 只有当没有 url 时才显示下载图标
            showRemoveIcon: true,
            // 自定义 removeIcon，阻止冒泡并调用 handleRemove
            removeIcon: (file: UploadFile) => (
              <DeleteOutlined
                onClick={async (e) => {
                  e.stopPropagation();
                  // 调用删除逻辑
                  await handleRemove(file);
                }}
              />
            ),
          }}
          onDownload={handleDownload}
        >
          {fileList.length >= 5 || !jczNo ? null : uploadButton}
        </Upload>
      </div>
    </div>
  );
}
