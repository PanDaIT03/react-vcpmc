import classNames from "classnames/bind";
import { ReactNode } from "react";
import { images } from "~/assets";

import styles from "~/sass/Contract.module.scss";
const cx = classNames.bind(styles);

interface ContractProps {
    title: string
    children?: ReactNode
};

export const Contract = ({
    title,
    children,
}: ContractProps) => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <div className={cx("paging")}>
                    <div className={cx("prev-page")}>Quản lý</div>
                    <img src={images.chevronRight} />
                    <div className={cx("current-page")}>Quản lý hợp đồng</div>
                </div>
                <div className={cx("title")}>
                    <h2>{title}</h2>
                </div>
                <div className={cx("content")}>{children}</div>
            </div>
        </div>
    );
};