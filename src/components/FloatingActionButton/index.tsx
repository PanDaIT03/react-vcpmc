import classNames from "classnames/bind";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { images } from "~/assets";
import { IGlobalConstantsType } from "~/types";
import { ActionBarItem } from "../ActionBar/ActionBarItem";

import styles from "~/sass/FloatingActionButton.module.scss";
const cx = classNames.bind(styles);

interface FloatingActionButonProps {
    data: Omit<IGlobalConstantsType, "id">[]
    className?: string
    visible?: boolean
    forwardedRef?: any
    setState?: Dispatch<SetStateAction<boolean>>
};

export const FloatingActionButon = ({
    data,
    className,
    visible = false,
    forwardedRef = null,
    setState
}: FloatingActionButonProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });
    const plusRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        visible
            ? plusRef.current?.classList.add(cx("rotate"))
            : plusRef.current?.classList.remove(cx("rotate"));
    }, [visible]);

    return (
        <div className={classes} ref={forwardedRef}>
            {data.length > 1
                ? <>
                    <img
                        alt="plus"
                        ref={plusRef}
                        src={images.uPlus}
                        onClick={() => setState && setState(!visible)}
                    />
                    <div
                        className={cx("action-bar-items")}
                        style={{ height: visible ? `${60 + (data.length * 52)}px` : "60px" }}
                    >
                        {data.length > 0 && data.map((item, index) =>
                            item.title && <ActionBarItem key={index} {...item} />)}
                    </div>
                </>
                : <ActionBarItem {...data[0]} />}
        </div>
    );
};