"use client";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Flex,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Space,
  Splitter,
  Table,
  theme,
} from "antd";
import styles from "./index.module.less";
import { cancelFeeApi, initYearApi, jczApi } from "../api";
import FeeInfo from "./components/feeInfo";
import DeadInfo from "./components/deadInfo";
import CertificateDetail from "./components/certificateDetail";
import Note from "./components/note";
import Position from "./components/position";
import Agent from "./components/agent";
import InitYear from "./components/initYear";
import { useReactToPrint } from "react-to-print";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JCZDataType, XRDataType } from "@/utils/types";
import FeeList from "./components/feeList";
import { getUser } from "@/utils/auth";

export default function DepositCertificateDetail() {
  const { token } = theme.useToken();
  const [detailData, setDetailData] = useState<JCZDataType>({ jczNo: "" });

  const [messageApi, contextHolder] = message.useMessage();
  let user = { userName: "" };
  const userData = getUser();
  if (userData) {
    user = JSON.parse(userData);
  }

  const getDepositCertificateDetail = useCallback(
    async ({ roomNo, caNo }: { roomNo: string; caNo: string }) => {
      const query = {
        isFuzzy: false,
        roomNo,
        caNo,
      };
      const { data } = await jczApi(query);
      if (data) {
        setDetailData(data[0]);
      }
    },
    []
  );

  const handleCancelFee = useCallback(async () => {
    try {
      await cancelFeeApi({ jczNo: detailData?.jczNo, operator: user.userName });
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
    getDepositCertificateDetail({
      roomNo: detailData.roomNo || "",
      caNo: detailData.caNo || "",
    });
  }, [
    detailData?.caNo,
    detailData?.jczNo,
    detailData?.roomNo,
    getDepositCertificateDetail,
    user.userName,
  ]);

  const handleInitYear = useCallback(
    async (year: string) => {
      try {
        await initYearApi({
          jczNo: detailData?.jczNo,
          operator: user.userName,
          initYear: year,
        });
      } catch (e: any) {
        messageApi.error(e.errorMessage);
      }
      if (detailData.caNo && detailData.roomNo) {
        getDepositCertificateDetail({
          roomNo: detailData.roomNo,
          caNo: detailData.caNo,
        });
      }
    },
    [
      detailData?.caNo,
      detailData?.jczNo,
      detailData?.roomNo,
      getDepositCertificateDetail,
      user.userName,
    ]
  );

  return (
    <div className={styles["cancel-fee"]}>
      {contextHolder}

      <br />
      <Card
        className={styles["custom-width"]}
        style={{
          width: "100%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "5px",
        }}
      >
        <CertificateDetail
          jczNo={detailData?.jczNo}
          created={detailData?.created}
          jfEndYear={detailData?.jfEndYear}
          jfStatus={detailData?.jfStatus}
        />
      </Card>
      <Flex justify="space-between" align="start" gap="small">
        <Card
          title="先人资料"
          style={{
            width: "35%",
            height: "100%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "5px",
          }}
        >
          <DeadInfo
            list={detailData?.xrList}
            valuesChangeCb={(xrList) => {}}
            outsideBox={false}
            outsideSelected={(selected) => {}}
          />
        </Card>
        <Flex
          justify="space-between"
          align="center"
          vertical
          style={{ width: "64%" }}
        >
          <Card
            className={styles["certificate-width"]}
            title="寄存位置"
            style={{
              width: "100%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "5px",
            }}
          >
            <Position
              cb={getDepositCertificateDetail}
              print={() => {}}
              caType={detailData?.caType}
              isNewJcz={false}
            />
          </Card>
          <Card
            className={styles["agent-width"]}
            title="委办人资料"
            style={{
              width: "100%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "5px",
            }}
          >
            <Agent
              wbrName={detailData?.wbrName}
              phoneNum={detailData?.phoneNum}
              wbrDesc={detailData?.wbrDesc}
              wbrId={detailData?.wbrId}
              address={detailData?.address}
              agentIsRevise={false}
              valuesChangeCb={(value) => {
                setDetailData({
                  ...detailData,
                  ...value,
                });
              }}
            />
          </Card>
        </Flex>
      </Flex>
      <Card
        style={{
          width: "100%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "5px",
        }}
      >
        <Note jczDesc={detailData?.jczDesc} noteDisabled={true} />
      </Card>

      <Card
        title="缴费单列表"
        style={{
          width: "100%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "5px",
        }}
      >
        <FeeList list={detailData?.jfList} />
      </Card>

      <Flex justify="space-between" align="start" gap="small">
        <Card
          title="初始化年份设置"
          style={{
            width: "35%",
            height: "100%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "5px",
          }}
        >
          <InitYear
            disabled={!detailData?.jczNo}
            cb={(year) => {
              handleInitYear(year);
            }}
          />
        </Card>
        <Flex
          justify="space-between"
          align="center"
          vertical
          style={{ width: "64%" }}
        >
          <Card
            title="缴费单注销"
            style={{
              width: "100%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "5px",
            }}
            extra={
              <div>
                <Flex gap="small" wrap>
                  <Button
                    type="link"
                    onClick={() => {
                      handleCancelFee();
                    }}
                  >
                    缴费单注销
                  </Button>
                </Flex>
              </div>
            }
          >
            <FeeInfo detailData={detailData} />
          </Card>
        </Flex>
      </Flex>
    </div>
  );
}
