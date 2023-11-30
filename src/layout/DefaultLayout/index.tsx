import classNames from "classnames/bind";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "../component/Sidebar";
import { Header } from "../component/Header";
import { RootState } from "~/state";
import { SidebarContext } from "~/context/SidebarContext";

import styles from "~/sass/DefaultLayout.module.scss";
const cx = classNames.bind(styles);

interface DefaultLayoutProps {
    children: ReactNode
};

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const { setActive } = useContext(SidebarContext);
    const userState = useSelector((state: RootState) => state.user);
    const { currentUser } = userState;

    const [account, setAccount] = useState({
        name: "",
        role: ""
    });
    const { name, role } = account;

    // useEffect(() => {
    //     let handler = (event: MouseEvent) => {
    //         if (!sidebarRef.current?.contains(event.target as Node))
    //             setActive(false);
    //     };
    //     document.addEventListener("mousedown", handler);

    //     return () => {
    //         document.removeEventListener("mousedown", handler);
    //     };
    // });

    useEffect(() => {
        if (!currentUser)
            return;

        if (currentUser.firstName && currentUser.lastName) {
            let firstName = currentUser.firstName.substring(0, 1),
                lastName = currentUser.lastName.split(' '),
                name = firstName.concat('. ', lastName[lastName.length - 1]);

            setAccount({ name: name, role: currentUser.role || "" });
        };
    }, [currentUser]);

    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <div className={cx("container_left")}>
                    <Sidebar
                        sidebarRef={sidebarRef}
                        onClick={() => setActive(true)}
                    />
                </div>
                <div className={cx("container_right")}>
                    <div className={cx("header")}>
                        <Header>
                            <div className={cx("account")} onClick={() => navigate("/basic-info")}>
                                <div className={cx("avatar")}>
                                    <img src={`../../images/${currentUser.avatar}`} />
                                </div>
                                <div className={cx("info")}>
                                    <p className={cx("name")}>{name}</p>
                                    <p className={cx("role")}>{role}</p>
                                </div>
                            </div>
                        </Header>
                    </div>
                    <div className={cx("content")}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};