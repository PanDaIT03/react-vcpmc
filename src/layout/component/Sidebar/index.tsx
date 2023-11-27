import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dropdown } from "~/component/Poper/Dropdown";
import { IGlobalConstantsType } from "~/types/GlobalConstantsType";
import { SIDEBAR_ITEMS } from "~/constants";
import { SidebarContext } from "~/context/SidebarContext";

import styles from "~/sass/Sidebar.module.scss";
const cx = classNames.bind(styles);

interface SidebarProps {
    sidebarRef?: any
    onClick?: () => void
};

interface SidebarItemProps {
    id: number
    title: string
    iconName: React.ReactNode
    className?: string
    children?: React.ReactElement
    data?: IGlobalConstantsType[]
    onClick: (item: IGlobalConstantsType) => void
};

const SidebarItem = ({
    id,
    title,
    iconName,
    className,
    children,
    data,
    onClick
}: SidebarItemProps) => {
    if (!className) className = "";

    const [visible, setVisible] = useState(false);
    const { currentPage, setCurrentPage } = useContext(SidebarContext);

    const classes = cx("item-wrapper", {
        [className]: className
    });

    useEffect(() => {
        setCurrentPage(4);
    }, []);

    return (
        <div
            className={classes}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onClick={() => setCurrentPage(id)}
        >
            {currentPage === id && <div className={cx("active")}></div>}
            <div className={cx("sidebar-item")}>
                <img src={`${iconName}`} className={cx("menu-icon")} />
                <p className={cx("title")}>{title}</p>
            </div>
            {data && <div className={cx("popup-item")}>
                <p className={cx("ellipsis")}>
                    <img src="../../images/u_ellipsis-v.png" />
                </p>
                <Dropdown
                    items={data}
                    className={cx("sidebar", visible && "visible")}
                    onClick={onClick}
                />
            </div>}
        </div>
    );
};

export const Sidebar = ({ sidebarRef, onClick }: SidebarProps) => {
    const navigate = useNavigate();
    const { active } = useContext(SidebarContext);

    const handleClickOption = useCallback((item: IGlobalConstantsType) => {
        item.to && navigate(`${item.to}`);
    }, []);

    return (
        <div className={cx("wrapper", !active && "inactive")} onClick={onClick} ref={sidebarRef}>
            {active ?
                <>
                    <div className={cx("logo")}>
                        <img src="../../images/logo.png" />
                    </div>
                    <div className={cx("sidebar-items")}>
                        {SIDEBAR_ITEMS.map((item, index) => (
                            <SidebarItem
                                key={index}
                                id={item.id}
                                title={item.title}
                                iconName={item.iconName}
                                data={item.children}
                                onClick={handleClickOption}
                            />
                        ))}
                    </div>
                </>
                : <img src="../../images/u_angle-right.png" />
            }
        </div>
    )
};