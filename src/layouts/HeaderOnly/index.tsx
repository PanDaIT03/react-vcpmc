import { ReactNode } from "react";
import { Header } from "../component/Header";

interface DefaultLayoutProps {
    children: ReactNode
};

export const HeaderOnly = ({ children }: DefaultLayoutProps) => {
    return (
        <div className="wrapper">
            <div className="header">
                <Header />
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    );
};