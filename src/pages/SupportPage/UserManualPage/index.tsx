import classNames from "classnames/bind";
import { useEffect, useState } from "react";

import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { USER_MANUAL_ITEMS } from "~/constants";

import style from '~/sass/SupportUserManual.module.scss';
const cx = classNames.bind(style);

export type UserManualItem = {
    title: string;
    content: string;
};

function SupportUserManualPage() {
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [userManualActive, setUserManualActive] = useState<UserManualItem>({
        title: '',
        content: ''
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Hỗ trợ',
                to: '#',
                active: true
            }, {
                title: 'Hướng dãn sử dụng',
                to: '#',
                active: true
            }
        ]);
    }, []);

    useEffect(() => {
        setUserManualActive(USER_MANUAL_ITEMS[0]);
    }, []);

    return (
        <CommonWrapper
            paging={paging}
            title='Hướng dẫn sử dụng'
            className={cx('container')}
        >
            <div className={cx('container__user-manual')}>
                <div className={cx('container__user-manual__title')}><p>Danh mục hướng dẫn</p></div>
                {USER_MANUAL_ITEMS.map((userManual, index) =>
                    <div
                        key={index}
                        onClick={() => setUserManualActive(userManual)}
                        className={cx('container__user-manual__item', userManual.title === userManualActive.title && 'active')}
                    ><p>{index + 1}. {userManual.title}</p></div>
                )}
            </div>
            <div className={cx('container__user-manual-detail')}>
                <p className={cx('user-manual-detail__title')}>{userManualActive.title}</p>
                <div className={cx('user-manual-detail__content')}>
                    <p>{userManualActive.content}</p>
                </div>
            </div>
        </CommonWrapper>
    );
};

export default SupportUserManualPage;