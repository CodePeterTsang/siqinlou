"use client";
import { Table, theme } from "antd";
// import { useRouter } from 'next/navigation';
import AvaForm from "./AvaForm";
import { columns, data } from "./column";
// import Layout from "@/components/Layout";
import styles from "./index.module.less";

export default function User() {
  const { token } = theme.useToken();

  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  return (
    <main className={styles.userWrap}>
      <div className={styles.content}>
        <AvaForm />
        <br />
        <div style={listStyle}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 500 }}
          />
        </div>
      </div>
    </main>
  );
}
