import classNames from "classnames/bind";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { ThemeProvider } from "~/context/Theme/ThemeContext";
import { RootState } from "~/state";
import { Header } from "../component/Header";
import { Sidebar } from "../component/Sidebar";

import styles from "~/sass/DefaultLayout.module.scss";
const cx = classNames.bind(styles);

interface DefaultLayoutProps {
    children: ReactNode
};

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const { active, setActive } = useContext(SidebarContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { currentUser } = useSelector((state: RootState) => state.user);

    const [account, setAccount] = useState({
        name: "",
        role: ""
    });
    const { name, role } = account;

    useEffect(() => {
        document.title = 'VCPMC - Trang quản trị';
    }, []);

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
            if (!sidebarRef.current?.contains(event.target as Node) && windowWidth <= 1805)
                setActive(false);
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    useEffect(() => {
        windowWidth <= 1805 ? setActive(false) : setActive(true);
    }, [windowWidth]);

    useEffect(() => {
        if (!currentUser)
            return;

        if (currentUser.firstName && currentUser.lastName && currentUser.role) {
            let firstName = currentUser.firstName.substring(0, 1),
                lastName = currentUser.lastName.split(' '),
                name = firstName.concat('. ', lastName[lastName.length - 1]);

            let splitRole = currentUser.role.split(' '),
                role = '';
            if (splitRole.length > 1)
                role = splitRole[0].substring(0, 1).concat('.', splitRole[splitRole.length - 1].substring(0, 1));
            else role = currentUser.role;

            setAccount({ name: name, role: role });
        };
    }, [currentUser]);

    return (
        <ThemeProvider>
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
                                <div className={cx("account")} onClick={() => navigate(routes.ProfilePage)}>
                                    <div className={cx("avatar")}>
                                        <img src={`${currentUser.avatar}`} alt="avatar" />
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
                {(windowWidth <= 1805 && active === true) && <div className={cx("disabled")}></div>}
            </div>
        </ThemeProvider>
    );
};