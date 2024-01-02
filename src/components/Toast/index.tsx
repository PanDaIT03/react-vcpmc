import classNames from "classnames/bind";
import { memo } from "react";

import styles from "~/sass/Toast.module.scss";
const cx = classNames.bind(styles);

interface ToastProps {
    message: string
    visible?: boolean
    className?: string
};

export const Toast = memo(({
    message,
    visible,
    className
}: ToastProps) => {
    if (!className) className = "";

    const classes = cx("toast", visible && "visible", {
        [className]: className
    });

    return (
        <div className={classes}>
            <div className={cx("icon-check")}>
                <div className={cx("checkmark_circle")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 44 44" fill="none">
                        <path d="M22 42.1668C33.1378 42.1668 42.1667 33.1379 42.1667 22.0002C42.1667 10.8624 33.1378 1.8335 22 1.8335C10.8623 1.8335 1.83337 10.8624 1.83337 22.0002C1.83337 33.1379 10.8623 42.1668 22 42.1668Z" stroke="#18E306" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className={cx("checkmark_check")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27.5" height="27.5" viewBox="0 0 28 28" fill="none">
                        <path d="M23.0833 7.0415L10.4792 19.6457L4.75 13.9165" stroke="#18E306" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <p className={cx("message")}>{message}</p>
        </div>
    );
})