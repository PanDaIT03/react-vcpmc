import classNames from "classnames/bind";
import { useCallback, useEffect, useRef, useState } from "react";

import { IGlobalConstantsType } from "~/types";
import { Dropdown } from "../Poper/Dropdown";
import { handleClickDropDown } from "~/constants";

import styles from "~/sass/OptionMenu.module.scss";
const cx = classNames.bind(styles);

interface OptionMenuProps {
    data: IGlobalConstantsType[]
    title: string
    className?: string
    boxSize?: "small" | "medium" | "large" | "extra large" | "custom"
    customDrop?: string
    setState?: React.Dispatch<React.SetStateAction<IGlobalConstantsType>>
};

export const OptionMenu = ({
    data,
    title,
    className,
    boxSize = "medium",
    customDrop = "primary",
    setState
}: OptionMenuProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });
    const initialState = data[0];

    const menuRef = useRef<HTMLDivElement>(null);

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

    const handleOption = (item: IGlobalConstantsType) => {
        let newOption = handleClickDropDown(item, data);

        setOption(newOption);
        setChoosen(item || initialState);
        setState && setState(item);
    };

    useEffect(() => {
        handleOption(initialState);
    }, []);

    const handleItemClick = useCallback((item: IGlobalConstantsType) => {
        handleOption(item);
    }, []);

    return (
        <div className={classes}>
            <div className={cx("title")}>{title}:</div>
            <div className={cx('filter_ownership_cb')} onClick={() => setOpen(!open)} ref={menuRef}>
                <div className={cx("choosen", boxSize)}>
                    {choosen.title}
                    <img src="./images/u_angle-down.png" />
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