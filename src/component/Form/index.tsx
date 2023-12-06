import classNames from "classnames/bind";
import { memo } from "react";

import styles from "~/sass/Form.module.scss";
const cx = classNames.bind(styles);

interface FormProps {
    title?: string
    children?: React.ReactNode
    className?: string
    type?: "dialog" | "normal"
    visible?: "visible" | "invisible" | ""
    handleFormSubmit?: (event: React.MouseEvent<HTMLFormElement>) => void
}

export const Form = memo(({
    title,
    children,
    className,
    type,
    visible,
    handleFormSubmit,
}: FormProps) => {
    if (!className) className = "";
    if (!type) type = "normal";
    if (!visible) visible = "";

    const classes = cx("wrapper", {
        [className]: className,
        [type]: type,
        [visible]: visible
    });

    return (
        <div className={classes}>
            {title !== undefined && <div className={cx("title")}>{title}</div>}
            <form className={cx("form")} onSubmit={handleFormSubmit}>
                {children}
            </form>
        </div>
    );
});