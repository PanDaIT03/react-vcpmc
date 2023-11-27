import { ReactNode, createContext, useState } from "react";

interface IProvider {
    children: ReactNode
};

interface IContext {
    active: boolean
    currentPage: number
    setActive: (active: boolean) => void
    setCurrentPage: (currentPage: number) => void
};

export const SidebarContext = createContext<IContext>({} as IContext);

export const AppProvider = ({ children }: IProvider) => {
    const [active, setActive] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    return <SidebarContext.Provider
        value={{
            active,
            currentPage,
            setActive,
            setCurrentPage
        }}>
        {children}
    </SidebarContext.Provider>
};