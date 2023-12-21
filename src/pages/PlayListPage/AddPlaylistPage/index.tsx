import classNames from "classnames/bind";
import { useContext, useEffect } from "react";

import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";

import styles from "~/sass/AddPlaylist.module.scss";
const cx = classNames.bind(styles);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Playlist',
        to: routes.PlaylistPage
    }, {
        title: 'Thêm playlist mới',
        to: "#"
    }
];

function AddPlaylistPage() {
    const { setActive } = useContext(SidebarContext);

    useEffect(() => {
        setActive(false);
    }, []);

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title="Thêm Playlist"
                paging={PAGING_ITEMS}
            >

            </CommonWrapper>
        </div>
    );
};

export default AddPlaylistPage;