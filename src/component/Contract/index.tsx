import classNames from "classnames/bind";
import { ReactNode } from "react";

import styles from "~/sass/Contract.module.scss";
const cx = classNames.bind(styles);

interface ContractProps {
    title: string
    children?: ReactNode
    tabs?: boolean
};

export const Contract = ({
    title,
    children,
    tabs = true
}: ContractProps) => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <div className={cx("paging")}>
                    <div className={cx("prev-page")}>Quản lý</div>
                    <img src="../../images/fi_chevron-right.png" />
                    <div className={cx("current-page")}>Quản lý hợp đồng</div>
                </div>
                <div className={cx("title")}>
                    <h2>{title}</h2>
                </div>
                {/* {tabs &&
                    <div className={cx("switch-tabs")}>
                        <div className={cx("tab", "active")}><p>Hợp đồng uỷ quyền</p></div>
                        <div className={cx("tab")}><p>Hợp đồng khai thác</p></div>
                    </div>
                } */}
                <div className={cx("content")}>{children}</div>
            </div>
        </div>
    );
};