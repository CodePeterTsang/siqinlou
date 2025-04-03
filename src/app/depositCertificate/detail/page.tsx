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
import { managerApi } from "@/app/superAdmin/api";
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
  /**
   * showFeeDetail 是为展示收费信息，点解缴费按钮
   */
  const [showFeeDetail, setShowFeeDetail] = useState<boolean>(false);
  const [feeCount, setFeeCount] = useState<number>(0);
  const [userData, setUserData] = useState({ userName: "", role: "admin" });

  const [askRecentPay, setAskRecentPay] = useState<boolean>(false);

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
  const [askInsideDiscount, setAskInsideDiscount] = useState<boolean>(false);
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
      } else if (roomNo && caNo) {
        {
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
      } else {
        setDetailData({ roomNo, caNo, jczNo: "" });
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
      if (addCertificate) {
        setDetailData({ ...detailData, xrList: xrList });
      } else {
        const { jczNo } = detailData;
        const editXrList = xrList.filter((item) => item.oriName);
        try {
          await jczEdit({
            jczNo,
            xrList: editXrList,
          });
          messageApi.success("修改成功");
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
      }
    },
    [detailData, getDepositCertificateDetail, messageApi]
  );

  const onInsideFinish = async () => {
    const row = (await xlInsideForm.validateFields()) as XRDataType;
    const { jczNo } = detailData;
    const { created, xrName } = row;
    const newXr = {
      created: dayjs(created).format("YYYY-MM-DD"),
      xrName,
      id: dayjs().unix(),
    };

    if (addCertificate) {
      const newXRList = detailData?.xrList
        ? [...detailData?.xrList, newXr]
        : [newXr];
      setDetailData({ ...detailData, xrList: newXRList });
    } else {
      try {
        await jczEdit({
          jczNo,
          xrList: [newXr],
          isDiscount: hasDiscount ? 1 : 0,
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
    }
    setInsideBox(false);
  };

  // 迁出盒
  const handleOutsideBox = async (isOutside: boolean) => {
    if (isOutside && detailData.jczNo) {
      if (addCertificate) {
        const newXrList = detailData.xrList?.filter(
          (item) => item.xrName !== outsideBoxSelected
        );
        setDetailData({ ...detailData, xrList: newXrList });
      } else {
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
    }
    setOutsideBox(false);
  };

  // 新增寄存证or迁入盒
  const handleDiscount = useCallback(
    (discount: boolean, openType = "addCertificate") => {
      setHasDiscount(discount);
      setAskDiscount(false);
      if (openType === "addCertificate") {
        setAddCertificate(true);
        handleNewJczNo();
      } else if (openType === "insideBox") {
        setAskInsideDiscount(false);
        setInsideBox(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [askDiscount]
  );

  const handleAddCertificate = async (isAdd: boolean) => {
    if (isAdd) {
      if (
        !detailData.roomNo ||
        !detailData.caNo ||
        !detailData.wbrName ||
        !detailData.xrList?.length
      ) {
        messageApi.info("请填写室号、格号、先人信息和委办人名称");
        return;
      }

      try {
        const { data } = await createJczApi({
          ...detailData,
          operator: userData.userName,
          isDiscount: hasDiscount ? 1 : 0,
        });
        getDepositCertificateDetail({
          roomNo: detailData.roomNo || "",
          caNo: detailData.caNo || "",
        });
        setAddCertificate(false);
        setDetailData(data);
        handlePayButton();
        messageApi.success("新增寄存证成功");
      } catch (e: any) {
        messageApi.error(e?.errorMessage);
      }
    } else {
      setAddCertificate(false);
      setDetailData({ jczNo: "" });
    }
  };
  const handleNewJczNo = async () => {
    try {
      const { data } = await createJczNo();
      setDetailData({ jczNo: data, created: dayjs().format("YYYY-MM-DD") });
    } catch (e: any) {
      setAddCertificate(false);
      messageApi.error("创建寄存证失败，请重试");
    }
  };

  const handlePay = useCallback(async () => {
    if (!feeCount) {
      messageApi.error("请输入缴费年限");
      return;
    }
    const { data } = await managerApi();

    try {
      const startYear = detailData.jfEndYear
        ? detailData.jfEndYear + 1
        : dayjs().year();
      const endYear = parseInt(startYear as string) + feeCount - 1;
      const xrLength = detailData.xrList?.length || 0;
      const unit =
        detailData.caType && detailData.caType > xrLength
          ? detailData.caType
          : xrLength;

      await jfdPayApi({
        jczNo: detailData.jczNo,
        startYear: `${startYear}`,
        endYear: `${endYear}`,
        operator: userData.userName,
        yearCount: `${feeCount}`,
        money: `${feeCount * unit * 150}`,
        jfCount: `${unit}`,
        manager: data,
      });
      getDepositCertificateDetail({
        roomNo: detailData.roomNo || "",
        caNo: detailData.caNo || "",
      });
      setShowFee(true);
      scrollToTop();
      messageApi.success("缴费成功");
      setShowFeeDetail(false);
    } catch (e: any) {
      messageApi.error(e.errorMessage);
    }
  }, [
    detailData.caNo,
    detailData.caType,
    detailData.jczNo,
    detailData.jfEndYear,
    detailData.roomNo,
    feeCount,
    getDepositCertificateDetail,
    messageApi,
    userData.userName,
  ]);

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

  const scrollToEnd = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handlePayButton = useCallback(() => {
    if (detailData?.jczNo) {
      if (
        detailData.jfList &&
        detailData.jfList.length &&
        detailData.jfList[0].operatingTime
      ) {
        if (
          dayjs().valueOf() - detailData.jfList[0].operatingTime <
          30 * 24 * 3600 * 1000
        ) {
          setAskRecentPay(true);
          return;
        }
      }
      handleAllStatus(setShowFeeDetail);
      scrollToEnd();
    }
  }, [detailData?.jczNo, handleAllStatus]);

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
    if (addCertificate) {
      setUrlParams({
        roomNo: "",
        caNo: "",
      });
    }
  }, [addCertificate]);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        // 收费
        if (showFeeDetail && detailData?.jczNo) {
          handlePay();
        }
        // 缴费单
        if (showFee && detailData?.jczNo) {
          setShowFee(false);
          printFee();
        }
      }
    };

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [detailData?.jczNo, handlePay, printFee, showFee, showFeeDetail]);

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
                    if (addCertificate) {
                      handleAllStatus(setInsideBox);
                    } else {
                      if (detailData?.jfStatus) {
                        handleAllStatus(setAskInsideDiscount);
                      } else {
                        messageApi.error("请先缴清费用，再进行迁入操作");
                      }
                    }
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
                    if (detailData?.jfStatus) {
                      handleAllStatus(setOutsideBox);
                    } else {
                      messageApi.error("请先缴清费用，再进行迁出操作");
                    }
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
                  handlePayButton();
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
            isNewJcz={addCertificate}
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
                handlePayButton();
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
              caNo={detailData?.caNo}
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
          noteDisabled={!reviseCertificate && !addCertificate}
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
            xrLength={detailData?.xrList?.length}
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
            xrLength={detailData?.xrList?.length}
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
        okText="是"
        cancelText="否"
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
        title="迁入盒"
        okText="是"
        cancelText="否"
        open={askInsideDiscount}
        onOk={() => {
          handleDiscount(true, "insideBox");
        }}
        onCancel={() => {
          handleDiscount(false, "insideBox");
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
      <Modal
        title="提示"
        okText="是"
        cancelText="否"
        open={askRecentPay}
        onOk={() => {
          handleAllStatus(setShowFeeDetail);
          scrollToEnd();
          setAskRecentPay(false);
        }}
        onCancel={() => {
          setAskRecentPay(false);
        }}
      >
        <p>
          本证于{detailData?.jfList && detailData?.jfList[0]?.created} 缴费
          {detailData?.jfList && detailData?.jfList[0]?.money}
          元，经手人：{detailData?.jfList && detailData?.jfList[0]?.operator}
        </p>
        <p>本寄存证最近曾缴费，请确认是否要继续缴费！</p>
        <p>按“是”继续缴费</p>
        <p>按“否”退出本次缴费</p>
        <p>如有疑问，请联系管理员</p>
      </Modal>
    </div>
  );
}
