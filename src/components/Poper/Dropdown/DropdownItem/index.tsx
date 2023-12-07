import classNames from "classnames/bind";
import { memo } from "react";

import { IGlobalConstantsType } from "~/types";
import style from "~/sass/Menu.module.scss";
const cx = classNames.bind(style);

interface DropdownItemProps {
    data: IGlobalConstantsType
    className?: string
    handleClickOption: any
};

export const DropdownItem = memo(({ data, className, handleClickOption }: DropdownItemProps) => {
    const { title } = data;
    const handleClick = (item: IGlobalConstantsType) => {
        handleClickOption(item);
    };

    return (
        <li className={cx("menu-item", className)} onClick={() => handleClick(data)}>
            <a>{title}</a>
        </li>
    );
});