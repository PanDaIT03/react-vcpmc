import classNames from "classnames/bind";

import styles from "~/sass/ActionBar.module.scss";
const cx = classNames.bind(styles);

interface ActionBarItemProps {
    icon?: string
    title?: string
    disable?: boolean
    className?: string
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
};

export const ActionBarItem = ({
    icon,
    title,
    disable = false,
    className,
    onClick,
    ...passprops
}: ActionBarItemProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        disable
    });
    const props = {
        onClick,
        ...passprops
    };

    return (
        <div className={classes} {...props}>
            <div className={cx("icon")}>
                <img src={icon} alt="icon" />
            </div>
            <div className={cx("title")}>{title}</div>
        </div>
    );
};