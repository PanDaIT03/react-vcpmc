import classNames from "classnames/bind";
import { ReactNode, memo, useCallback, useContext, useEffect } from "react";

import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { DOWNLOAD_ITEMS } from "~/constants";
import { IDownloadItem } from "~/types/SupportType";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";

import style from '~/sass/Download.module.scss';
const cx = classNames.bind(style);

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Hỗ trợ',
        to: '#',
        active: true
    }, {
        title: 'Tải App',
        to: '#',
        active: true
    }
];

interface DownloadBoxItemProps {
    data: IDownloadItem;
    className?: string;
};

const DownloadBoxItem = memo(({ data, className }: DownloadBoxItemProps) => {
    return (
        <div className={cx('download__box-item', className)}>
            {data.image}
            <Button primary fill value={data.title} />
        </div>
    );
});

function DownloadPage() {
    const { setCurrentPage } = useContext(SidebarContext);

    useEffect(() => {
        setCurrentPage(7);
    }, []);

    return (
        <CommonWrapper
            title='Tải App'
            paging={PAGING_ITEMS}
            className={cx('support-download')}
        >
            <div className={cx('support-download__content')}>
                <p className={cx('support-download__content__title')}>ứng dụng <span>vcpmc</span></p>
                <div className={cx('support-download__content__sub-title')}>
                    <p>Bạn vui lòng chọn</p>
                    <span>nền tảng</span>
                    <span> phù hợp để trải nghiệm</span>
                </div>
                <div className={cx('support-download__content__download')}>
                    {DOWNLOAD_ITEMS.map(item => {
                        let imageTag: ReactNode = <></>;
                        imageTag = <img src={item.image} alt={item.title} style={{ width: "189px", height: "104px" }} />

                        return <DownloadBoxItem key={item.title} data={{
                            image: imageTag,
                            title: item.title
                        }} />
                    })}
                </div>
            </div>
            {/* <Vector /> */}
        </CommonWrapper>
    );
};

export default DownloadPage;