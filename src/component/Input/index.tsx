import classNames from "classnames/bind";
import { memo, useEffect, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import styles from "~/sass/Input.module.scss";
const cx = classNames.bind(styles);

interface InputProps {
    id?: string
    name: string
    value: string | number
    title?: string
    placeholder?: string
    className?: string
    errorMessage?: string
    min?: number
    max?: number
    steps?: number
    iconLeft?: string //path
    iconRight?: string //path
    status?: "disable" | "editable"
    type?: "text" | "password" | "number" | "date" | "range"
    size?: "small" | "medium" | "large" | "extra-large" | "custom"
    onBlur?: any
    onFocus?: any
    inputRef?: any
    touched?: boolean
    readOnly?: boolean
    iconLeftAwesome?: IconProp
    iconRightAwesome?: IconProp
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onIconLeftClick?: (event: React.MouseEvent<HTMLImageElement>) => void
    onIconRightClick?: (event: React.MouseEvent<HTMLImageElement>) => void
};

export const Input = memo(({
    id,
    name,
    value,
    title,
    size,
    readOnly,
    status,
    className,
    touched = false,
    errorMessage,
    iconLeft,
    iconRight,
    iconLeftAwesome,
    iconRightAwesome,
    onBlur,
    inputRef,
    onChange,
    onIconLeftClick,
    onIconRightClick,
    ...passProps
}: InputProps) => {
    if (!size) size = "medium";
    if (!status) status = "editable";
    if (!className) className = "";

    const props = {
        id: id,
        name: name,
        value: value,
        onChange,
        ...passProps
    };

    const classes = cx("wrapper", {
        [className]: className,
        [size]: size,
        [status]: status
    });
    const [isInValid, setIsInValid] = useState(false);

    useEffect(() => {
        if (typeof errorMessage === 'undefined')
            setIsInValid(false);
        else if (value === '' && touched)
            setIsInValid(true);
    }, [errorMessage]);

    const handleBlur = () => {
        if (typeof errorMessage !== 'undefined')
            setIsInValid(true);
        else
            setIsInValid(false);
        onBlur && onBlur();
    };

    return (
        <div className={classes}>
            {title && <label htmlFor={id}>{title}:</label>}
            <div className={cx("form-input", isInValid ? "error" : "")}>
                <input
                    {...props}
                    onBlur={handleBlur}
                    readOnly={readOnly ? true : false}
                    ref={inputRef}
                />
                {(iconLeft || iconRight && value !== "") &&
                    <img
                        className={cx("icon", `${iconLeft ? "left" : "right"}`, "--cursor-pointer")}
                        src={iconLeft ? iconLeft : iconRight}
                        alt="icon eye"
                        onClick={iconLeft ? onIconLeftClick : onIconRightClick}
                    />
                }
            </div>
        </div>
    );
});