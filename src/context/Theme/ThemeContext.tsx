import { ReactNode, createContext, useEffect, useState } from "react";
import { THEME_IMAGES } from "~/constants";

export interface ITheme {
    id: number;
    name: string;
    imageURL: string;
};

interface IProvider {
    children: ReactNode;
};

interface IContext {
    data: Array<ITheme>;
    theme: ITheme;
    setTheme: React.Dispatch<React.SetStateAction<ITheme>>;
};

export const ThemeContext = createContext<IContext>({} as IContext);

export const ThemeProvider = ({ children }: IProvider) => {
    const [themeActive, setThemeActive] = useState<ITheme>({} as ITheme);

    const THEME_ITEMS: Array<ITheme> = THEME_IMAGES.map((image, index) => ({
        id: index,
        name: `theme ${index + 1}`,
        imageURL: image
    }));

    console.log(THEME_ITEMS);

    useEffect(() => {
        setThemeActive(THEME_ITEMS[0]);
    }, []);

    return <ThemeContext.Provider
        value={{
            data: THEME_ITEMS,
            theme: themeActive,
            setTheme: setThemeActive
        }}
    >
        {children}
    </ThemeContext.Provider>
};