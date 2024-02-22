import classNames from "classnames/bind";
import React from "react";

import styles from "~/sass/ActionBar.module.scss";
const cx = classNames.bind(styles);

interface ActionBarItemOwnProps<E extends React.ElementType> {
    icon?: string
    title?: string
    disable?: boolean
    as?: E
    className?: string
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
};

type ActionBarItemProps<E extends React.ElementType> = ActionBarItemOwnProps<E> &
    Omit<React.ComponentProps<E>, keyof ActionBarItemOwnProps<E>>

// interface ActionBarItemProps {
//     icon?: string
//     title?: string
//     disable?: boolean
//     className?: string
//     onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
// };

export const ActionBarItem = <E extends React.ElementType = 'div'>({
    icon,
    title,
    as,
    disable = false,
    className,
    onClick,
    ...passprops
}: ActionBarItemProps<E>) => {
    let Component = as || 'div';

    if (!className) className = "";

    const classes = cx("wrapper", {
        disable
    });
    const props = {
        onClick,
        ...passprops
    };

    return (
        <Component className={classes} {...props}>
            <div className={cx("icon")}>
                <img src={icon} alt="icon" />
            </div>
            <div className={cx("title")}>{title}</div>
        </Component>
    );
};