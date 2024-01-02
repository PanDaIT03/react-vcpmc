import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import styles from "~/sass/Dialog.module.scss";
const cx = classNames.bind(styles);

interface DialogProps {
    primary?: boolean
    size?: "small" | "custom"
    content?: "audio" | "none"
    visible: boolean
    children: ReactNode
    alignCenter?: "vertical" | "horizontal" | "all" | "not-aligned"
    className?: string
};

export const Dialog = memo(({
    primary,
    size,
    content = "none",
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
        [content]: content,
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