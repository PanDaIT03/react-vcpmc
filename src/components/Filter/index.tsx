import classNames from "classnames/bind";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { images } from "~/assets";
import { IGlobalConstantsType } from "~/types";
import { Input } from "../Input";
import { IOptionMenu, OptionMenu } from "../OptionMenu";

import styles from "~/sass/Filter.module.scss";
const cx = classNames.bind(styles);

interface IFilter {
    data: IOptionMenu[]
    search: any
    className?: string
    width?: "max-content" | "max-width-100pc"
    spaceBetween?: "auto" | "default"
    searchPosition?: "top" | "right" | "bottom" | "left"
};

interface FilterItemProps {
    title?: string
    data: IGlobalConstantsType[]
    setState?: Dispatch<SetStateAction<IGlobalConstantsType>>
};

const FilterItem = ({ title, data, setState }: FilterItemProps) => {
    const [active, setActive] = useState(1);

    const handleClick = (itemChoosen: IGlobalConstantsType) => {
        setActive(itemChoosen.id);
        setState && setState(itemChoosen);
    };

    return (
        <>
            <div className={cx("item__title")}>{title}:</div>
            <div className={cx("list-item")}>
                {data.map((item, index) =>
                    <div
                        key={index}
                        className={cx("item__content", active === item.id && "active")}
                        onClick={() => handleClick(item)}
                    >
                        {item.title}
                    </div>)}
            </div>
        </>
    );
};

export const Filter = ({
    data,
    search,
    className,
    width = "max-width-100pc",
    spaceBetween = "default",
    searchPosition = "right"
}: IFilter) => {
    if (!className) className = "";

    const classes = cx("container", {
        [className]: className,
        [width]: width,
        [searchPosition]: searchPosition
    });

    const [visible, setVisible] = useState(false);
    const [filterIcon, setFilterIcon] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const containerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    const dataStandardization = data.filter(item => Object.keys(item).length > 0);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });

    useEffect(() => {
        let handler = (event: MouseEvent) => {
            if (!filterRef.current?.contains(event.target as Node))
                setVisible(false);
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    useEffect(() => {
        if (!containerRef.current?.clientWidth || !filterRef.current?.clientWidth) return;

        const filterWidth = containerRef.current?.clientWidth
            - (((searchPosition === "top" || searchPosition === "bottom") ? 0 : 501) + 24);

        console.log("(containerRef", containerRef.current?.clientWidth);
        console.log("(filterRef", filterRef.current?.clientWidth);
        console.log("(filterWidth", filterWidth);

        if (filterRef.current?.clientWidth >= filterWidth)
            filterIcon === false && setFilterIcon(true);
    });

    const renderFilter = () => {
        return data.map((item, index) =>
            Object.keys(item).length > 0 && <OptionMenu key={index} {...item} />);
    };

    return (
        <div className={classes} ref={containerRef}>
            {Object.keys(dataStandardization).length > 0
                && <div className={cx("container__left", spaceBetween)} ref={filterRef}>
                    {(windowWidth && (windowWidth <= 1860 && filterIcon))
                        ? <div className={cx("filter")}>
                            <div className={cx("filter__icon")} onClick={() => setVisible(!visible)}>
                                <img src={images.filter} alt="filter" />
                            </div>
                            <div className={cx("filter__dropdown", !visible && "in-active")}>
                                <div className={cx("title")}>Lọc theo</div>
                                <div className={cx("content")}>
                                    <div className={cx("dropdown-list")}>
                                        {dataStandardization.map((item, index) => (
                                            <div className={cx("item")} key={index}>
                                                <FilterItem
                                                    title={item.title}
                                                    data={item.data}
                                                    setState={item.setState} />
                                            </div>))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        : renderFilter()}
                </div>}
            <div className={cx("container__right")}>
                {(Object.keys(search).length > 0 && search !== null) && <Input {...search.tag.props} />}
            </div>
        </div>
    );
};