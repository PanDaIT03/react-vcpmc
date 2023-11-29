import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import React from "react";

import style from "~/sass/Button.module.scss";
const cx = classNames.bind(style);

interface IButtonProps {
    value: string
    primary?: boolean
    fill?: boolean
    className?: string
    buttonType?: "button" | "submit"
    size?: "small" | "medium" | "large" | "extra large"
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    loading?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function Button({
    primary,
    fill = false,
    size = "medium",
    leftIcon,
    rightIcon,
    value,
    className,
    buttonType = "button",
    loading = false,
    onClick
}: IButtonProps) {
    const props = {
        onClick,
        type: buttonType,
    };

    if (!className) className = "";
    if (!size) size = "medium";
    if(!buttonType) buttonType = "button"

    const classes = cx("wrapper", {
        [className]: className,
        [size]: size,
        primary,
        fill
    });

    return (
        <button className={classes} {...props}>
            {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
            {loading
                ? <FontAwesomeIcon icon={faSpinner} spin className={cx("title")} />
                : <div className={cx("title")}>{value}</div>
            }
            {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
        </button>
    );
}

export default Button;