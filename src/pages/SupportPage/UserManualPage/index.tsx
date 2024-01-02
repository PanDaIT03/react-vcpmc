import classNames from "classnames/bind";

import { useEffect, useState } from "react";
import { PagingItemType } from "~/components/Paging";
import { CommonWrapper } from "~/components/CommonWrapper";

import style from '~/sass/SupportUserManual.module.scss';
const cx = classNames.bind(style);

type UserManualItem = {
    title: string;
    content: string;
}

function SupportUserManualPage() {
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [userManualActive, setUserManualActive] = useState<UserManualItem>({ title: '', content: '' });

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

    const USER_MANUAL_ITEMS: Array<UserManualItem> = [
        {
            title: 'Lorem ipsum dolor sit amet',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Consectetur adipiscing elit sed do',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Iusmod tempor incididunt ut labo',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Ut enim ad minim veniam',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Quis nostrud exercitation ullamco',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Excepteur sint occaecat cupidatats',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Sunt in culpa qui officiat',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }, {
            title: 'Sed ut perspiciatis unde omnis iste',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea 
            sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui 
            nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget 
            morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam, 
            tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan 
            et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque 
            placerat eget lorem eget maecenas.`
        }
    ];

    useEffect(() => {
        setUserManualActive(USER_MANUAL_ITEMS[0]);
    }, []);

    return (
        <CommonWrapper
            title='Hướng dẫn sử dụng'
            paging={paging}
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
    )
}

export default SupportUserManualPage;