import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import { IGlobalConstantsType } from "~/types";
import { FloatingActionButon } from "../FloatingActionButton";
import { ActionBarItem } from "./ActionBarItem";

import styles from "~/sass/ActionBar.module.scss";
const cx = classNames.bind(styles);

interface ActionBarProps {
    visible?: boolean
    data: Omit<IGlobalConstantsType, "id">[]
};

export const ActionBar = ({ visible = true, data }: ActionBarProps) => {
    const floatingButtonRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
            if (!floatingButtonRef.current?.contains(event.target as Node))
                setShow(false);
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className={cx("wrapper", visible && "active")}>
            {windowWidth <= 768
                ? <FloatingActionButon
                    data={data}
                    visible={show}
                    setState={setShow}
                    forwardedRef={floatingButtonRef}
                />
                : <div className={cx("action-bar-items")}>
                    {data.length > 0 && data.map((item, index) =>
                        item.title && <ActionBarItem key={index} {...item} />)}
                </div>}
        </div>
    );
};