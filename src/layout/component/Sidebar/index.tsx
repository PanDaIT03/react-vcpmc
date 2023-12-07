import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dropdown } from "~/components/Poper/Dropdown";
import { IGlobalConstantsType } from "~/types/GlobalConstantsType";
import { SIDEBAR_ITEMS } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { images } from "~/assets";

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
    className?: string
    children?: React.ReactElement
    data?: IGlobalConstantsType[]
    onClick: (item: IGlobalConstantsType) => void
};

const SidebarItem = ({
    id,
    title,
    icon,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={sidebarRef}
            className={cx("wrapper", active ? "active" : "inactive")}
            onClick={onClick}
        >
            {active ?
                <>
                    <div className={cx("logo")}>
                        <img src={images.logo} alt="logo" />
                    </div>
                    <div className={cx("sidebar-items")}>
                        {SIDEBAR_ITEMS.map((item, index) => (
                            <SidebarItem
                                key={index}
                                id={item.id}
                                title={item.title}
                                icon={item.icon}
                                data={item.children}
                                onClick={handleClickOption}
                            />
                        ))}
                    </div>
                </>
                : <img src={images.angleRight} alt="angleRight" />
            }
        </div>
    )
};