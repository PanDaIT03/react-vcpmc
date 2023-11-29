import classNames from "classnames/bind";
import { ReactNode } from "react";

import styles from "~/sass/Tabs.module.scss";
const cx = classNames.bind(styles);

interface TabsProps {
    className?: string
    children?: ReactNode
};

interface TabProps {
    title: string
    pageRef?: any
    status: "active" | "inactive"
    onClick?: () => void
};

export const Tab = ({
    title,
    pageRef,
    status,
    onClick
}: TabProps) => {
    const classes = cx("tab", {
        [status]: status
    });

    return (
        <div
            ref={pageRef}
            className={classes}
            onClick={onClick}
        >
            <p>{title}</p>
        </div>
    );
};

export const Tabs = ({ className, children }: TabsProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            <div className={cx("switch-tabs")}>
                {children}
            </div>
        </div>
    );
};