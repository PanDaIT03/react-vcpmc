import classNames from "classnames/bind";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { Dropdown } from "~/components/Poper/Dropdown";
import { SIDEBAR_ITEMS } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { IGlobalConstantsType } from "~/types/GlobalConstantsType";

import styles from "~/sass/Sidebar.module.scss";
const cx = classNames.bind(styles);

interface SidebarProps {
    sidebarRef?: any
    onClick?: () => void
};

interface SidebarItemProps {
    id: number
    title: string
    icon: string
    to?: string
    className?: string
    children?: React.ReactElement
    data?: IGlobalConstantsType[]
    onClick: (item: IGlobalConstantsType) => void
};

const SidebarItem = ({
    id,
    title,
    icon,
    to,
    className,
    children,
    data,
    onClick
}: SidebarItemProps) => {
    if (!className) className = "";

    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const { currentPage, setCurrentPage } = useContext(SidebarContext);

    const classes = cx("item-wrapper", {
        [className]: className
    });

    return (
        <div
            className={classes}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onClick={() => {
                setCurrentPage(id);
                to && navigate(to);
            }}
        >
            {currentPage === id && <div className={cx("active")}></div>}
            <div className={cx("sidebar-item")}>
                <img src={icon} className={cx("menu-icon")} alt="menuIcon" />
                <p className={cx("title")}>{title}</p>
            </div>
            {data && <div className={cx("popup-item")}>
                <p className={cx("ellipsis")}>
                    <img src={images.ellipsisV} alt="ellipsisIcon" />
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
        <div
            ref={sidebarRef}
            className={cx("wrapper", active ? "active" : "inactive")}
            onClick={onClick}
        >
            <div className={cx("content")} style={{ display: active ? "flex" : "none" }}>
                <div className={cx("logo")}>
                    <img src={images.logo} alt="logo" />
                </div>
                <div className={cx("sidebar-items")}>
                    {SIDEBAR_ITEMS.map((item, index) => (
                        <SidebarItem
                            key={index}
                            id={item.id}
                            title={item.title}
                            to={item.to}
                            icon={item.icon}
                            data={item.children}
                            onClick={handleClickOption}
                        />
                    ))}
                </div>
            </div>
            : <img src={images.angleRight} alt="angleRight" style={{ display: !active ? "flex" : "none" }} />
        </div>
    );
};