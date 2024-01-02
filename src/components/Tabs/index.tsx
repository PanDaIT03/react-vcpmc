import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import styles from "~/sass/Tabs.module.scss";
const cx = classNames.bind(styles);

interface TabsProps {
    className?: string
    children?: ReactNode
};

export interface TabProps {
    visible: boolean
    title: string
    pageRef?: any
    onClick?: () => void
    className?: string
};

export const Tab = memo(({
    visible,
    title,
    pageRef,
    onClick,
    className
}: TabProps) => {
    const classes = cx("tab", visible && "active", className);

    return (
        <div
            ref={pageRef}
            className={classes}
            onClick={onClick}
        >
            <p>{title}</p>
        </div>
    );
});

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