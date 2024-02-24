import classNames from "classnames/bind";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { images } from "~/assets";
import { IGlobalConstantsType } from "~/types";
import { OptionMenu } from "../OptionMenu";

import styles from "~/sass/Filter.module.scss";
const cx = classNames.bind(styles);

interface FilterProps {
    data: IFilter[]
    size?: number
};

export interface IFilter {
    title: string
    data: IGlobalConstantsType[]
    setState?: Dispatch<SetStateAction<IGlobalConstantsType>>
};

const FilterItem = ({ title, data, setState }: IFilter) => {
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
    size
}: FilterProps) => {
    const [visible, setVisible] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const renderFilter = () => {
        return data.map((item, index) => (
            <OptionMenu
                key={index}
                title={item.title}
                data={item.data}
                setState={item.setState}
            />
        ));
    };

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

    return (
        <div className={cx("container")} ref={filterRef}>
            {size && size <= 1860
                ? <div className={cx("filter")}>
                    <div className={cx("filter__icon")} onClick={() => setVisible(!visible)}>
                        <img src={images.filter} alt="filter" />
                    </div>
                    <div className={cx("filter__dropdown", !visible && "in-active")}>
                        <div className={cx("title")}>Lọc theo</div>
                        <div className={cx("content")}>
                            <div className={cx("dropdown-list")}>
                                {data.map((item, index) => (
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
        </div>
    );
};