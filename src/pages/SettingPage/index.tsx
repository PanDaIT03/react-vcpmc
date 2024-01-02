import { faCheck, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useContext, useEffect, useReducer, useState } from "react";

import { CommonWrapper } from "~/components/CommonWrapper";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { Toast } from "~/components/Toast";
import { routes } from "~/config/routes";
import { LANGUAGE_ITEMS } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { ITheme } from "~/context/Theme/ThemeContext";
import { useTheme } from "~/hooks/useTheme";
import { IGlobalConstantsType } from "~/types";

import style from '~/sass/Setting.module.scss';
const cx = classNames.bind(style);

interface IScroll {
    count: number;
};

interface IAction {
    type: 'UP' | 'DOWN';
    payload: { totalItem: number; }
};

const initialState: IScroll = {
    count: 0
};

const scrollReducer = (state: IScroll, action: IAction) => {
    switch (action.type) {
        case 'UP':
            let countUp = state.count + 1;

            console.log(state.count);
            console.log(action.payload.totalItem);
            console.log(action.payload.totalItem - 3 === state.count);

            if (action.payload.totalItem - 3 === state.count) countUp = state.count;

            return { count: countUp };
        case 'DOWN':
            let countDown = state.count - 1;
            if (state.count === 0) countDown = state.count;

            return { count: countDown };
        default:
            throw new Error('Invalid action type!');
    }
};

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Cài đặt',
        to: routes.SettingPage,
        active: true
    }, {
        title: 'Cài đặt hệ thống',
        to: '#',
        active: true
    }
];

function SettingPage() {
    const { data: themeData, theme, setTheme } = useTheme();
    const [scroll, dispatch] = useReducer(scrollReducer, initialState);

    const { setActive, setCurrentPage } = useContext(SidebarContext);
    const [activeToast, setActiveToast] = useState<boolean>(false);

    const [themes, setThemes] = useState<ITheme[]>([] as ITheme[]);

    const [languageChoosen, setLanguageChoosen] = useState<IGlobalConstantsType>({
        id: 0,
        title: ''
    });

    useEffect(() => {
        setActive(true);
        setCurrentPage(6);
    }, []);

    useEffect(() => {
        setThemes(themeData.filter(item => item.id !== theme.id));
    }, [theme]);

    const handleSetLanguage = (theme: ITheme) => {
        setTheme(theme);

        setActiveToast(true);
        setTimeout(() => {
            setActiveToast(false);
        }, 1000);
    };

    console.log(activeToast);

    return (
        <CommonWrapper
            paging={PAGING_ITEMS}
            title='Cài đặt cấu hình'
            className={cx('config-container')}
        >
            <div className={cx('config-container__theme')}>
                <div className={cx('theme__active')}>
                    <img src={theme.imageURL} alt='theme' style={{ borderRadius: '0' }} />
                    <FontAwesomeIcon icon={faCheck} />
                    <p>{theme.name}</p>
                </div>
                <div className={cx('theme__items')}>
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        onClick={() => dispatch({ type: 'DOWN', payload: { totalItem: themes.length } })} />
                    <div className={cx('items__container')}>
                        {themes.map((theme, index) =>
                            <div
                                key={index}
                                className={cx('item')}
                                style={{ marginLeft: `${index === 0 && `calc((-246px - 23px) * ${scroll.count})`}` }}
                                onClick={() => handleSetLanguage(theme)}
                            >
                                <img
                                    src={theme.imageURL}
                                    alt='them-item'
                                    style={{ borderRadius: '0' }}
                                />
                                <p>{theme.name}</p>
                            </div>
                        )}
                    </div>
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        onClick={() => dispatch({ type: 'UP', payload: { totalItem: themes.length } })} />
                </div>
            </div>
            <div className={cx('config-container__language')}>
                <OptionMenu
                    data={LANGUAGE_ITEMS}
                    title='Ngôn ngữ hiển thị'
                    className={cx('language__combo-box')}
                    borderColor="var(--text-stroke-text-and-stroke-2)"
                    setState={setLanguageChoosen}
                />
            </div>
            <Toast visible={activeToast} message='Đổi theme thành công' />
        </CommonWrapper>
    );
};

export default SettingPage;