import classNames from "classnames/bind";
import { ReactNode, useEffect, useRef } from "react";

import styles from "~/sass/CancleForm.module.scss";
const cx = classNames.bind(styles);

interface CancleForm {
    id?: string
    name?: string
    title?: string
    placeholder?: string
    className?: string
    status: "active" | "inactive"
    children?: ReactNode
    textareaRef: any
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
};

export const CancleForm = ({
    id,
    name,
    title,
    placeholder,
    className,
    status,
    children,
    textareaRef,
    onChange
}: CancleForm) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className,
    });

    return (
        <div className={classes}>
            <div className={cx("content", status)}>
                {title && <p className={cx("title")}>{title}</p>}
                <textarea
                    id={id}
                    name={name}
                    className={cx("textarea")}
                    placeholder={placeholder}
                    onChange={onChange}
                    ref={textareaRef}
                >
                </textarea>
                {children}
            </div>
        </div>
    );
};