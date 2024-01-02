import classNames from "classnames/bind";
import { Dispatch, SetStateAction, memo } from "react";

import { images } from "~/assets";
import styles from "~/sass/SwitchViewButton.module.scss";
const cx = classNames.bind(styles);

interface SwitchViewButtonProps {
    className?: string
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
};

export const SwitchViewButton = memo(({
    className,
    state,
    setState
}: SwitchViewButtonProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            <div className={cx("list")} onClick={() => setState(false)}>
                <img
                    src={images.list}
                    className={cx(!state ? "active" : "inactive")}
                    alt="list"
                />
            </div>
            <div className={cx("grid")} onClick={() => setState(true)}>
                <img
                    src={images.grid}
                    className={cx(state ? "active" : "inactive")}
                    alt="grid"
                />
            </div>
        </div>
    );
});