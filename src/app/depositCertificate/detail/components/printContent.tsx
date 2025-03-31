"use client";
import { Card, theme } from "antd";
import { forwardRef, useEffect, useState } from "react";
import styles from "./../index.module.less";
import classNames from "classnames";
import { JCZDataType, JXDataType } from "@/utils/types";
import dayjs from "dayjs";
import { number2text } from "@/utils/changeUnit";

export default forwardRef(function PrintContent(
  props: { data: JCZDataType },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [jxData, setJxData] = useState<JXDataType | undefined>(
    props.data?.jfList ? props.data?.jfList[0] : undefined
  );

  useEffect(() => {
    setJxData(props.data?.jfList ? props.data?.jfList[0] : undefined);
  }, [props.data]);

  return (
    <Card>
      <div ref={ref} className={styles["print-content"]}>
        <div className={styles.title}>海珠区瑞宝街石溪经济联合社收款收据</div>
        <div className={styles.time}>
          <span className={styles.year}> {dayjs(jxData?.created).year()}</span>
          <span className={styles["year-font"]}>年</span>
          <span className={styles.month}>
            {dayjs(jxData?.created).month() + 1}
          </span>
          <span className={styles["month-font"]}>月</span>
          <span className={styles.day}>{dayjs(jxData?.created).date()}</span>
          <span className={styles["day-font"]}>日</span>
        </div>
        <div className={classNames(styles.name, styles.line)}>
          <span
            className={classNames(styles["name-title"], styles["item-title"])}
          >
            交款单位名
            <br />
            称(或姓名)
          </span>
          <span className={styles["name-content"]}>{props.data?.wbrName}</span>
        </div>
        <div className={classNames(styles.money, styles.line)}>
          <div className={classNames(styles.line)}>
            <div
              className={classNames(styles["item-title"])}
              style={{
                width: "2cm",
                height: "2cm",
                display: "flex",
                alignItems: "center",
              }}
            >
              收费
              <br />
              项目
            </div>
            <div>
              <p className={styles["item-one"]}>设施建设维护费</p>
              <p className={styles["item-two"]}>寄存费</p>
            </div>
          </div>

          <div>
            <p>
              <span
                className={classNames(styles["item-title"], styles["jin-e"])}
              >
                金额：
              </span>
              <span className={styles["item-one-money"]}>
                {jxData?.fwMoney}
              </span>
            </p>
            <p>
              <span
                className={classNames(styles["item-title"], styles["jin-e"])}
              >
                金额：
              </span>
              <span className={styles["item-two-money"]}>
                {jxData?.jcMoney}
              </span>
            </p>
          </div>
          <div className={classNames(styles.line)}>
            <span className={styles["item-title"]} style={{ width: "1cm" }}>
              合计
              <br />
              金额
            </span>
            <span className={styles["total-money"]}>{jxData?.money}</span>
          </div>
        </div>
        <div className={classNames(styles.position, styles.line)}>
          <span className={styles["item-title"]}>所属位置</span>

          <p>
            <span className={styles["room-no"]}>{props.data?.roomNo}</span>
            <span className={styles["no-show"]}>室号</span>
            <span className={styles["ca-no"]}>{props.data?.caNo}</span>
            <span className={styles["no-show"]}>穴号</span>

            <span className={styles["start-year"]}>{jxData?.startYear}</span>
            <span className={styles["no-show"]}>至</span>

            <span className={styles["end-year"]}>{jxData?.endYear}</span>
          </p>
        </div>
        <div className={classNames(styles.rmb, styles.line)}>
          <span className={styles["item-title"]}>
            合计人民币
            <br />
            (大写)
          </span>
          <span className={styles.up}>
            {number2text(parseInt(jxData?.money || "0"))}
          </span>
        </div>
        <div className={classNames(styles.note, styles.line)}>
          <span className={styles["item-title"]}>备注：</span>
          <span className={styles["note-content"]}>{jxData?.jfDesc}</span>
        </div>
        <div className={classNames(styles["charge-man"], styles.line)}>
          <p>
            <span className={styles["item-title"]}> 开票人：</span>
            <span>{jxData?.operator}</span>
          </p>
          <p>
            <span className={styles["item-title"]}>收款人：</span>
            <span>{jxData?.manager}</span>
          </p>
          <p>
            <span className={styles["item-title"]}>收款单位盖章：</span>
          </p>
        </div>
      </div>
    </Card>
  );
});
