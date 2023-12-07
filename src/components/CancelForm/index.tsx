import classNames from "classnames/bind";
import { ReactNode } from "react";

import styles from "~/sass/CancleForm.module.scss";
const cx = classNames.bind(styles);

interface CancleFormProps {
    id: string
    name: string
    title: string
    placeholder?: string
    className?: string
    children?: ReactNode
    textareaRef?: any
    value?: string
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
};

export const CancleForm = ({
    id,
    name,
    title,
    placeholder,
    className,
    children,
    textareaRef,
    value,
    onChange
}: CancleFormProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            {title && <p className={cx("title")}>{title}</p>}
            {!value
                ? <textarea
                    id={id}
                    name={name}
                    className={cx("textarea")}
                    placeholder={placeholder}
                    onChange={onChange}
                    ref={textareaRef}
                >
                </textarea>
                : <div className={cx("text")}>{value}</div>}
            {children}
        </div>
    );
};