import classNames from "classnames/bind";
import { ReactNode } from "react";

import styles from "~/sass/ActionBar.module.scss";
const cx = classNames.bind(styles);

interface ActionBarProps {
    visible?: boolean
    children: ReactNode
};

export const ActionBar = ({ visible = true, children }: ActionBarProps) => {
    return (
        <div className={cx("wrapper", visible && "active")}>
            <div className={cx("action-bar-items")}>
                {children}
            </div>
        </div>
    );
};