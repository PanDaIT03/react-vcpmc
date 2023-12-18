import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import styles from "~/sass/Dialog.module.scss";
const cx = classNames.bind(styles);

interface DialogProps {
    primary?: boolean
    size?: "small" | "custom"
    visible: boolean
    className?: string
    children: ReactNode
    alignCenter?: "vertical" | "horizontal" | "all" | "not-aligned"
};

export const Dialog = memo(({
    primary,
    size,
    visible,
    className,
    children,
    alignCenter,
    ...passProps
}: DialogProps) => {
    if (!size) size = "custom";
    if (!className) className = "";
    if (!alignCenter) alignCenter = "not-aligned";

    const classes = cx("content", visible && "active", {
        [className]: className,
        [alignCenter]: alignCenter,
        [size]: size,
        primary
    });

    return (
        <div className={cx("wrapper")}>
            <div className={classes}>
                {children}
            </div>
        </div>
    );
});