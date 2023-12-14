import classNames from "classnames/bind";
import { memo } from "react";

import { IGlobalConstantsType } from "~/types";
import styles from "~/sass/BoxItem.module.scss";
const cx = classNames.bind(styles);

interface BoxItemProps {
    data: IGlobalConstantsType[]
    className?: string
};

export const BoxItem = memo(({
    data,
    className
}: BoxItemProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={cx(classes)}>
            {data.map((item, index) => (
                <div key={index} className={cx("item")}>
                    <div className={cx("title")}>{item.title}</div>
                    <div className={cx("content")}>{typeof item.value === "string" && item.value}</div>
                </div>
            ))}
        </div>
    );
});