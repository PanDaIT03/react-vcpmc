import classNames from "classnames/bind";
import { useCallback, useEffect, useRef, useState } from "react";

import { Dropdown } from "../Poper/Dropdown";
import { LANGUAGE_ITEMS, handleClickDropDown } from "~/constants";
import { IGlobalConstantsType } from "~/types";

import styles from "~/sass/Language.module.scss";
const cx = classNames.bind(styles);

const initStateLanguage = {
    id: 1,
    title: "Tiếng Việt",
    icon: "./images/vietnam_flag.png"
};

export const Language = () => {
    const menuRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [languages, setLanguages] = useState<IGlobalConstantsType[]>(LANGUAGE_ITEMS);
    const [language, setLanguage] = useState<IGlobalConstantsType>(initStateLanguage);

    useEffect(() => {
        let handler = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const handleLanguage = (item: IGlobalConstantsType) => {
        let newLanguages = handleClickDropDown(item, LANGUAGE_ITEMS);

        setLanguages(newLanguages);
        setLanguage(item || initStateLanguage);
    };

    useEffect(() => {
        handleLanguage(initStateLanguage);
    }, []);

    const handleItemClick = useCallback((item: IGlobalConstantsType) => {
        handleLanguage(item);
        setOpen(false);
    }, []);

    return (
        <div className={cx("container")}>
            <div ref={menuRef} className={cx("language")}>
                <div
                    className={cx("language__primary")}
                    onClick={() => setOpen(!open)}
                >
                    <div className={cx("title")}>{language.title}</div>
                    <img src={language.icon} className={cx("language-icon")} />
                    <img src="../../images/angle-down.png" alt="agle down" />
                </div>
                <Dropdown
                    items={languages}
                    className={cx("language-dropdown")}
                    onClick={handleItemClick}
                    visible={open}
                />
            </div>
        </div>
    );
};