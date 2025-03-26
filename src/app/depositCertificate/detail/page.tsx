"use client";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Space,
  theme,
} from "antd";
import styles from "./index.module.less";
import { getUrlParams } from "@/utils/params";
import {
  cancelJczApi,
  createJczApi,
  createJczNo,
  jczApi,
  jczEdit,
  jfdPayApi,
  outsideBoxApi,
} from "../api";
import FeeDetail from "./components/feeDetail";
import FeeInfo from "./components/feeInfo";
import DeadInfo from "./components/deadInfo";
import CertificateDetail from "./components/certificateDetail";
import Note from "./components/note";
import Position from "./components/position";
import Agent from "./components/agent";
import PrintContent from "./components/printContent";
import { useReactToPrint } from "react-to-print";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { JCZDataType, XRDataType } from "@/utils/types";
import dayjs from "dayjs";
import { getUser } from "@/utils/auth";
import React from "react";
import dynamic from "next/dynamic";
const NoSSR = (props: any) => <React.Fragment>{props.children}</React.Fragment>;
const DynamicSidebarWithNoSSR = dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
// type FieldType = {
//   username?: string;
//   created?: string;
//   jfEndYear?: string;
//   jfStatus: string;
// };

type XrFieldType = {
  xrName?: string;
  created?: string;
};

export default function DepositCertificateDetail() {
  const { token } = theme.useToken();

  const searchParams = useSearchParams();
  const [urlParams, setUrlParams] = useState({ roomNo: "", caNo: "" });
  const [detailData, setDetailData] = useState<JCZDataType>({ jczNo: "" });
  const [showFee, setShowFee] = useState<boolean>(false);
  const [showFeeDetail, setShowFeeDetail] = useState<boolean>(false);
  const [feeCount, setFeeCount] = useState<number>(0);
  const [userData, setUserData] = useState({ userName: "", role: "admin" });

  // 修改证
  const [reviseCertificate, setReviseCertificate] = useState<boolean>(false);
  // 新增证
  const [addCertificate, setAddCertificate] = useState<boolean>(false);
  const [askDiscount, setAskDiscount] = useState<boolean>(false);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  // 注销证
  const [cancelCertificate, setCancelCertificate] = useState<boolean>(false);

  // 迁入盒
  const [insideBox, setInsideBox] = useState<boolean>(false);
  // 修改盒
  const [reviseBox, setReviseBox] = useState<boolean>(false);
  // 迁出盒
  const [outsideBox, setOutsideBox] = useState<boolean>(false);
  const [outsideBoxSelected, setOutsideBoxSelected] = useState<string>("");

  const [messageApi, contextHolder] = message.useMessage();
  const [xlInsideForm] = Form.useForm();

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };

  const getDepositCertificateDetail = useCallback(
    async ({ roomNo, caNo }: { roomNo: string; caNo: string }) => {
      if (addCertificate) {
        setDetailData({ ...detailData, roomNo, caNo });
      } else {
        const query = {
          isFuzzy: false,
          roomNo,
          caNo,
        };
        const { data } = await jczApi(query);
        if (data.length) {
          setDetailData(data[0]);
        } else {
          setDetailData({ roomNo, caNo, jczNo: "" });
        }
      }
    },
    [addCertificate, detailData]
  );

  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const printFee = () => {
    reactToPrintFn();
  };

  const handleCancelCertificate = useCallback(async () => {
    try {
      await cancelJczApi({
        jczNo: detailData?.jczNo,
        operator: userData.userName,
      });
      messageApi.success("注销成功");
    } catch (e: any) {
      messageApi.error(e?.errorMessage);
    }
    setCancelCertificate(false);
  }, [detailData?.jczNo, messageApi]);

  // 修改证
  const handleReviseCertificate = useCallback(
    async (isReviseCertificate: boolean) => {
      if (isReviseCertificate) {
        const { jczNo, wbrName, address, phoneNum, wbrId, wbrDesc, jczDesc } =
          detailData;
        try {
          await jczEdit({
            jczNo,
            wbrName,
            address,
            phoneNum,
            wbrId,
            wbrDesc,
            jczDesc,
          });
        } catch (e) {
          messageApi.open({
            type: "error",
            content: "修改先人信息失败",
          });
        }
      }
      getDepositCertificateDetail({
        roomNo: detailData.roomNo || "",
        caNo: detailData.caNo || "",
      });
      setReviseCertificate(false);
    },
    [detailData, getDepositCertificateDetail, messageApi]
  );

  // 修改盒
  const handleReviseBox = useCallback(
    async (xrList: XRDataType[]) => {
      const { jczNo } = detailData;
      try {
        await jczEdit({
          jczNo,
          xrList,
        });
      } catch (e) {
        messageApi.open({
          type: "error",
          content: "修改先人信息失败",
        });
      }
      getDepositCertificateDetail({
        roomNo: detailData.roomNo || "",
        caNo: detailData.caNo || "",
      });
    },
    [detailData, getDepositCertificateDetail, messageApi]
  );

  const onInsideFinish = async () => {
    const row = (await xlInsideForm.validateFields()) as Partial<XRDataType>;
    const { jczNo } = detailData;
    const { created, xrName } = row;
    const newXr = {
      created: dayjs(created).format("YYYY-MM-DD"),
      xrName,
    };

    try {
      await jczEdit({
        jczNo,
        xrList: [newXr],
      });
    } catch (e) {
      messageApi.open({
        type: "error",
        content: "修改先人信息失败",
      });
    }
    setInsideBox(false);
    getDepositCertificateDetail({
      roomNo: detailData.roomNo || "",
      caNo: detailData.caNo || "",
    });
  };

  // 迁出盒
  const handleOutsideBox = async (isOutside: boolean) => {
    if (isOutside && detailData.jczNo) {
      try {
        await outsideBoxApi({
          xrName: outsideBoxSelected,
          jczNo: detailData.jczNo,
        });
        getDepositCertificateDetail({
          roomNo: detailData.roomNo || "",
          caNo: detailData.caNo || "",
        });
      } catch (e) {
        messageApi.error("迁出失败");
      }
    }
    setOutsideBox(false);
  };

  // 新增寄存证
  const handleDiscount = useCallback(
    (discount: boolean) => {
      setHasDiscount(discount);
      setAddCertificate(true);
      handleNewJczNo();
      setAskDiscount(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [askDiscount]
  );

  const handleAddCertificate = async (isAdd: boolean) => {
    if (isAdd) {
      if (!detailData.roomNo || !detailData.caNo || !detailData.wbrName) {
        messageApi.info("请填写室号、格号和委办人名称");
        return;
      }
      try {
        await createJczApi({
          ...detailData,
          operator: userData.userName,
          isDiscount: hasDiscount ? 1 : 0,
        });
      } catch (e) {
        messageApi.error("新增失败");
      }
    }
    getDepositCertificateDetail({
      roomNo: detailData.roomNo || "",
      caNo: detailData.caNo || "",
    });
    setAddCertificate(false);
  };
  const handleNewJczNo = async () => {
    try {
      const { data } = await createJczNo();
      setDetailData({ jczNo: data, created: dayjs().format("YYYY-MM-DD") });
    } catch (e) {
      messageApi.error("新增失败");
    }
  };

  const handlePay = async () => {
    try {
      const startYear = detailData.jfEndYear ? detailData.jfEndYear : 0 + 1;
      const endYear = parseInt(startYear as string) + feeCount;
      await jfdPayApi({
        jczNo: detailData.jczNo,
        startYear: `${startYear}`,
        endYear: `${endYear}`,
        operator: userData.userName,
        yearCount: `${feeCount}`,
        money: `${
          feeCount * (detailData.caType ? detailData.caType : 0) * 150
        }`,
        jfCount: `${detailData.caType}`,
      });
      getDepositCertificateDetail({
        roomNo: detailData.roomNo || "",
        caNo: detailData.caNo || "",
      });
      setShowFee(true);
      messageApi.success("缴费成功");
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
    setShowFeeDetail(false);
  };

  const handleAllStatus = useCallback(
    (openStatus: Dispatch<SetStateAction<boolean>>) => {
      if (detailData) {
        setShowFeeDetail(false);
        setOutsideBox(false);
        setReviseCertificate(false);
        setCancelCertificate(false);
        setShowFee(false);
        setInsideBox(false);
      }
      setAskDiscount(false);
      openStatus(true);
    },
    [detailData]
  );

  useEffect(() => {
    const url = `${searchParams}`;
    const param = getUrlParams(url);
    if (param) {
      setUrlParams({
        roomNo: param.roomNo,
        caNo: param.caNo,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  return (
    <div className={styles["deposit-certificate-detail"]}>
      {contextHolder}

      <div>
        {/* <div style={{ display: "none" }}> */}
        {/* <PrintContent ref={contentRef} /> */}
      </div>
      <div>
        <DynamicSidebarWithNoSSR>
          <div style={{ textAlign: "left" }}>
            <Space size="small">
              {userData.role === "admin" ? (
                <Button
                  disabled={!detailData.jczNo}
                  onClick={() => {
                    handleAllStatus(setInsideBox);
                  }}
                >
                  迁入盒
                </Button>
              ) : (
                ""
              )}
              {userData.role === "admin" ? (
                <Button
                  disabled={!detailData.jczNo}
                  onClick={() => {
                    handleAllStatus(setOutsideBox);
                  }}
                >
                  迁出盒
                </Button>
              ) : (
                ""
              )}
              {userData.role === "admin" ? (
                <Button
                  disabled={addCertificate}
                  onClick={() => {
                    handleAllStatus(setAskDiscount);
                  }}
                >
                  新增证
                </Button>
              ) : (
                ""
              )}
              <Button
                disabled={addCertificate || !detailData.jczNo}
                onClick={() => {
                  handleAllStatus(setReviseCertificate);
                }}
              >
                修改证
              </Button>
              {userData.role === "admin" ? (
                <Button
                  disabled={addCertificate || !detailData.jczNo}
                  onClick={() => {
                    handleAllStatus(setCancelCertificate);
                  }}
                >
                  注销证
                </Button>
              ) : (
                ""
              )}

              <Button
                disabled={addCertificate || !detailData.jczNo}
                type="primary"
                onClick={() => {
                  // printFee();
                  handleAllStatus(setShowFeeDetail);
                }}
              >
                缴费
              </Button>
              <Button
                disabled={addCertificate || !detailData.jczNo}
                type="primary"
                onClick={() => {
                  handleAllStatus(setShowFee);
                }}
              >
                缴费单
              </Button>
            </Space>
          </div>
        </DynamicSidebarWithNoSSR>
      </div>
      <br />
      {addCertificate ? (
        <Card
          className={styles["custom-width"]}
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
                    handleAddCertificate(true);
                  }}
                >
                  确认新增寄存证
                </Button>
                <Button
                  type="text"
                  onClick={() => {
                    handleAddCertificate(false);
                  }}
                >
                  取消
                </Button>
              </Flex>
            </div>
          }
        >
          <CertificateDetail
            jczNo={detailData?.jczNo}
            created={detailData?.created}
            jfEndYear={detailData?.jfEndYear}
            jfStatus={detailData?.jfStatus}
          />
        </Card>
      ) : (
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
      )}

      <Flex justify="space-between" align="start" gap="small">
        <Card
          title="先人资料"
          style={{
            width: "35%",
            height: "100%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "5px",
          }}
          extra={
            <div>
              {outsideBox ? (
                <Flex gap="small" wrap>
                  <Button
                    type="link"
                    onClick={() => {
                      handleOutsideBox(true);
                    }}
                  >
                    确认迁出
                  </Button>
                  <Button
                    type="text"
                    onClick={() => {
                      handleOutsideBox(false);
                    }}
                  >
                    取消
                  </Button>
                </Flex>
              ) : (
                ""
              )}
            </div>
          }
        >
          <DeadInfo
            list={detailData?.xrList}
            valuesChangeCb={(xrList) => {
              handleReviseBox(xrList);
            }}
            outsideBox={outsideBox}
            outsideSelected={(selected) => {
              setOutsideBoxSelected(selected.xrName);
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
              print={() => {
                // printFee();
                handleAllStatus(setShowFeeDetail);
              }}
              caType={detailData?.caType}
              isNewJcz={addCertificate}
              roomNo={urlParams.roomNo}
              caNo={urlParams.caNo}
              disabled={showFeeDetail}
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
            extra={
              <div>
                {reviseCertificate ? (
                  <Flex gap="small" wrap>
                    <Button
                      type="link"
                      onClick={() => {
                        handleReviseCertificate(true);
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        handleReviseCertificate(false);
                      }}
                    >
                      取消
                    </Button>
                  </Flex>
                ) : (
                  ""
                )}
              </div>
            }
          >
            <Agent
              wbrName={detailData?.wbrName}
              phoneNum={detailData?.phoneNum}
              wbrDesc={detailData?.wbrDesc}
              wbrId={detailData?.wbrId}
              address={detailData?.address}
              agentIsRevise={reviseCertificate || addCertificate}
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
        <Note
          jczDesc={detailData?.jczDesc}
          noteDisabled={!reviseCertificate}
          valuesChangeCb={(value) => {
            setDetailData({
              ...detailData,
              ...value,
            });
          }}
        />
      </Card>
      <Flex justify="space-between" align="start">
        <Card
          title="缴费明细"
          style={{
            width: "35%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "5px",
          }}
        >
          <FeeDetail
            startYear={detailData.jfEndYear}
            showFeeDetail={showFeeDetail}
            list={detailData?.jfList}
            feeCount={feeCount}
            caType={detailData.caType}
          />
        </Card>
        <Card
          title="缴费信息"
          style={{
            width: "64%",
            height: "100%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "5px",
          }}
          extra={
            <div>
              {showFeeDetail ? (
                <Flex gap="small" wrap>
                  <Button
                    type="link"
                    onClick={() => {
                      handlePay();
                    }}
                  >
                    确认缴费
                  </Button>
                  <Button
                    type="text"
                    onClick={() => {
                      setShowFeeDetail(false);
                    }}
                  >
                    取消
                  </Button>
                </Flex>
              ) : (
                ""
              )}
            </div>
          }
        >
          <FeeInfo
            showFeeDetail={showFeeDetail}
            startYear={detailData.jfEndYear}
            caType={detailData.caType}
            feeInfoCb={(value) => {
              setFeeCount(value);
            }}
          />
        </Card>
      </Flex>

      {/* 下面都是弹窗 */}

      <Modal
        title="注销证"
        open={cancelCertificate}
        onOk={handleCancelCertificate}
        onCancel={() => {
          setCancelCertificate(false);
        }}
      >
        <p>是否确认注销编号为{detailData?.jczNo}的寄存证</p>
      </Modal>
      <Modal
        title="迁入盒"
        open={insideBox}
        onOk={onInsideFinish}
        onCancel={() => {
          setInsideBox(false);
        }}
      >
        <Form
          name="xlInside"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={xlInsideForm}
        >
          <Form.Item<XrFieldType>
            label="先人姓名"
            name="xrName"
            rules={[{ required: true, message: "请输入先人名称!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<XrFieldType>
            label="迁入日期"
            name="created"
            rules={[{ required: true, message: "请选择迁入日期!" }]}
          >
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新增证"
        open={askDiscount}
        onOk={() => {
          handleDiscount(true);
        }}
        onCancel={() => {
          handleDiscount(false);
        }}
      >
        <p>请确认是否符合办理优惠寄存条件？</p>
        <p>符合按“是”</p>
        <p>不符合按“否”</p>
        <p>如有疑问，请联系管理员</p>
      </Modal>
      <Modal
        title="打印缴费单"
        open={showFee}
        onOk={() => {
          setShowFee(false);
          printFee();
        }}
        onCancel={() => {
          setShowFee(false);
        }}
        width={650}
      >
        <PrintContent ref={contentRef} data={detailData} />
      </Modal>
    </div>
  );
}
