import classNames from "classnames/bind";
import { ReactNode } from "react";

import { Language } from "~/component/Language";
import styles from "~/sass/Header.module.scss";
const cx = classNames.bind(styles);

interface HeaderProps {
    children?: ReactNode
};

export const Header = ({ children }: HeaderProps) => {
    return (
        <div className={cx("wrapper")}>
            <Language />
            {children}
        </div>
    );
};