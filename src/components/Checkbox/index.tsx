import classNames from "classnames/bind";
import { wrap } from "module";
import { memo } from "react";

import { images } from "~/assets";
import styles from "~/sass/Checkbox.module.scss";
const cx = classNames.bind(styles);

interface CheckboxProps {
    visible: boolean
    checked?: boolean
    label?: string
    labelMaxWidth?: string
    className?: string
    onClick?: () => void
};

export const Checkbox = memo(({
    visible,
    checked,
    label,
    labelMaxWidth,
    className,
    onClick,
    ...passProps
}: CheckboxProps) => {
    if (!className) className = "";
    if (!labelMaxWidth) labelMaxWidth = "";

    const props = {
        onClick,
        ...passProps
    };

    const classes = cx("wrapper", visible && "active", {
        [className]: className
    });

    return (
        <div className={classes} {...props}>
            {visible && !checked
                ? <img src={images.checkbox} alt="checkbox" />
                : (
                    <p className={cx("checkbox-checked")}>
                        <img src={images.check} alt="checkbox" />
                    </p>
                )}
            {label &&
                <label onClick={onClick} style={{
                    maxWidth: `${labelMaxWidth}px`,
                    display: "flex",
                }}>
                    <p>{label}</p>
                </label>}
        </div>
    );
});