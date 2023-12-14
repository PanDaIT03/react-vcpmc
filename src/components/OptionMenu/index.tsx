import classNames from "classnames/bind";
import { useCallback, useEffect, useRef, useState } from "react";

import { IGlobalConstantsType } from "~/types";
import { Dropdown } from "../Poper/Dropdown";
import { handleClickDropDown } from "~/constants";
import { images } from "~/assets";

import styles from "~/sass/OptionMenu.module.scss";
const cx = classNames.bind(styles);

interface OptionMenuProps {
    data: IGlobalConstantsType[]
    title?: string
    titlePosition?: "top" | "left"
    boxSize?: "small" | "medium" | "large" | "small-pl" | "extra-large" | "extra-extra-large" | "custom"
    customDrop?: string
    editable?: boolean
    border?: boolean
    borderColor?: string
    className?: string
    state?: IGlobalConstantsType
    setState?: React.Dispatch<React.SetStateAction<IGlobalConstantsType>>
};

export const OptionMenu = ({
    data,
    title,
    titlePosition = "left",
    boxSize = "medium",
    customDrop = "primary",
    editable = true,
    border = true,
    borderColor,
    className,
    state,
    setState,
    ...passProps
}: OptionMenuProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", !border && "none-border", {
        [className]: className,
        editable,
    });

    const titleRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    let initialState = data[0];
    if (state)
        initialState = state;

    const [open, setOpen] = useState(false);
    const [option, setOption] = useState<IGlobalConstantsType[]>(data);
    const [choosen, setChoosen] = useState<IGlobalConstantsType>(initialState);

    useEffect(() => {
        let handler = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    useEffect(() => {
        const wrapperHeight = menuRef.current?.clientHeight || 0;

        if (titlePosition === "top") {
            titleRef.current?.setAttribute("style",
                `position: absolute;
                z-index: 3;
                bottom: ${wrapperHeight + 8}px;
            `);
        };
    }, []);

    useEffect(() => {
        handleOption(initialState);
    }, [data, state]);

    const handleItemClick = useCallback((item: IGlobalConstantsType) => {
        handleOption(item);
        setState && setState(item);
    }, []);

    const handleOption = (item: IGlobalConstantsType) => {
        let newOption = handleClickDropDown(item, data);

        setOption(newOption);
        setChoosen(item || initialState);
    };

    return (
        <div className={classes}>
            {title
                && <div className={cx("title")} ref={titleRef}>{title}:</div>}
            <div className={cx('filter_ownership_cb')} onClick={() => setOpen(!open)} ref={menuRef}>
                <div
                    className={cx("choosen", boxSize)}
                    style={{ borderColor: `${borderColor}` }}
                >
                    {choosen.title}
                    <img src={images.angleDown} alt="angle-down" />
                </div>
                <Dropdown
                    items={option}
                    visible={open}
                    className={cx(customDrop)}
                    onClick={handleItemClick}
                />
            </div>
        </div >
    )
};