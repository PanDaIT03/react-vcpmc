import classNames from "classnames/bind";
import { ReactNode, useEffect, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { images } from "~/assets";
import styles from "~/sass/Input.module.scss";
const cx = classNames.bind(styles);

interface InputOwnProps<E extends React.ElementType> {
    id?: string
    name: string
    value?: string | number
    title?: string
    checked?: boolean
    placeholder?: string
    className?: string
    errorMessage?: string
    isRequire?: boolean
    // border?: boolean
    border?: "orange-4-default" | "default-border" | "none"
    min?: any
    max?: any
    steps?: number
    iconLeft?: string //path
    iconRight?: string //path
    status?: "disable" | "editable"
    as?: E
    type?: "text" | "password" | "number" | "date" | "range"
    size?: "extra-small" | "small" | "small-pl" | "medium" | "large" | "extra-large" | "custom" | "none"
    onBlur?: any
    onFocus?: any
    inputRef?: any
    touched?: boolean
    readOnly?: boolean
    iconLeftAwesome?: IconProp
    iconRightAwesome?: IconProp
    children?: ReactNode
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onIconLeftClick?: (event: React.MouseEvent<HTMLImageElement>) => void
    onIconRightClick?: (event: React.MouseEvent<HTMLImageElement>) => void
};

type InputProps<E extends React.ElementType> = InputOwnProps<E> &
    Omit<React.ComponentProps<E>, keyof InputOwnProps<E>>

export const Input = <E extends React.ElementType = 'input'>({
    id,
    name,
    value,
    title,
    as,
    isRequire = false,
    border = "default-border",
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
    children,
    onChange,
    onIconLeftClick,
    onIconRightClick,
    ...passProps
}: InputProps<E>) => {
    let Component = as || 'input';

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
        [size]: size,
        [status]: status,
        [className]: className
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
            {title
                && <div className={cx("title")}>
                    <label htmlFor={id}>{title}:</label>
                    {isRequire && <img src={images.require} alt="require" />}
                </div>}
            <div className={cx("form-input", isInValid ? "error" : "")}>
                <Component
                    {...props}
                    ref={inputRef}
                    onBlur={handleBlur}
                    readOnly={readOnly ? true : false}
                    // className={cx("text", border && "border", borderColor)}
                    className={cx("text", border)}
                />
                {((iconLeft || iconRight) && value !== "") &&
                    <img
                        className={cx("icon", `${iconLeft ? "left" : "right"}`, "--cursor-pointer")}
                        src={iconLeft ? iconLeft : iconRight}
                        alt="icon eye"
                        onClick={iconLeft ? onIconLeftClick : onIconRightClick}
                    />
                }
                {children}
            </div>
        </div>
    );
};