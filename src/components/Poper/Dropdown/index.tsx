import classNames from "classnames/bind";
import { memo } from "react";

import { DropdownItem } from "./DropdownItem";
import { IGlobalConstantsType } from "~/types";

import style from "~/sass/Menu.module.scss";
const cx = classNames.bind(style);

interface MenuProps {
    items: IGlobalConstantsType[]
    className?: string
    visible?: boolean
    onClick: (item: IGlobalConstantsType) => void
};

export const Dropdown = memo(({
    items = [],
    className,
    visible,
    onClick
}: MenuProps) => {
    if (!className) className = "";
    const classes = cx("wrapper", {
        [className]: className,
        visible
    });

    const renderItems = () => (
        items.map((item, index) => {
            return <DropdownItem
                key={index}
                data={item}
                handleClickOption={onClick}
            />
        })
    );

    return (
        <div className={classes}>
            <div className={cx("list-menu")}>
                <ul className={cx("menu-items")}>{renderItems()}</ul>
            </div>
        </div>
    );
});