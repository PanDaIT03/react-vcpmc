import classNames from "classnames/bind";
import { Dispatch, ReactNode, SetStateAction, memo } from "react";

import styles from "~/sass/Dialog.module.scss";
const cx = classNames.bind(styles);

interface DialogProps {
    primary?: boolean
    size?: "small" | "custom"
    visible: boolean
    className?: string
    children: ReactNode
    setVisible: Dispatch<SetStateAction<boolean>>
    alignCenter?: "vertical" | "horizontal" | "all" | "not-aligned"
};

export const Dialog = memo(({
    primary,
    size,
    visible,
    className,
    children,
    alignCenter
}: DialogProps) => {
    if (!className) className = "";
    if (!size) size = "custom";
    if (!alignCenter) alignCenter = "not-aligned";

    const classes = cx("wrapper", visible && "active", {
        [className]: className,
        [alignCenter]: alignCenter,
        size,
        primary,
    });

    return (
        <div className={classes}>
            {visible && children}
        </div>
    );
});