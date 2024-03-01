import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { BoxItem } from "~/components/BoxItem";
import { CommonWrapper } from "~/components/CommonWrapper";
import { GridView } from "~/components/GridView";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { SwitchViewButton } from "~/components/SwitchViewButtons";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { getTotalMoment } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getPlayListAction } from "~/state/thunk/playlist";
import { resetNewRecordsAction } from "~/state/thunk/record";
import { IGlobalConstantsType, IRecord } from "~/types";
import { IPLaylist } from "~/types/PlaylistType";
import { Filter } from "~/components/Filter";

import styles from "~/sass/PlayList.module.scss";
const cx = classNames.bind(styles);

function PlayListPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [search, setSearch] = useState<Pick<IGlobalConstantsType, "tag">>({});
    const [isGridView, setIsGridView] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState('8');
    const { setActive, setCurrentPage } = useContext(SidebarContext);

    const { playList, loading } = useSelector((state: RootState) => state.playlist);
    const [currentItems, setCurrentItems] = useState<IPLaylist[]>([]);

    useEffect(() => {
        setCurrentPage(2);
        dispatch(getPlayListAction());
        dispatch(resetNewRecordsAction());
        setActive(true);
    }, []);

    useEffect(() => {
        setSearch({
            tag: <Input
                id="search"
                name="search"
                value={searchValue}
                placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                size="custom"
                iconRight={images.search}
                onChange={(event) => setSearchValue(event.target.value)}
                onIconRightClick={handleClickSearch}
            />
        });
    }, [searchValue]);

    const handleClickSearch = () => { };
    const handlePlaylistClick = () => { };

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    const handleCurrentItems = (items: any[]) => {
        setCurrentItems(items);
    };

    const handleItemsPerPage = (value: string) => {
        setItemsPerPage(value);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper title="Playlist">
                <div className={cx("action")}>
                    <Filter data={[]} search={search} />
                    <SwitchViewButton state={isGridView} setState={setIsGridView} />
                </div>
                {!isGridView
                    ? <Table
                        className={cx("playlist")}
                        paginate={{
                            dataForPaginate: playList,
                            setCurrentItems: handleCurrentItems
                        }}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleItemsPerPage}
                        thead={["STT", "Tiêu đề", "Số bản ghi", "Thời lượng", "Chủ đề", "Ngày tạo", "Người tạo", ""]}
                    >
                        {currentItems.map((item, index) => {
                            let boxData: IGlobalConstantsType[] = [];
                            item.categories.map((category, index) => boxData.push({ id: index + 1, value: category }));

                            return (
                                <tr className={cx("playlist_item")} key={index}>
                                    <td >{index + 1}</td>
                                    <td >{item.title}</td>
                                    <td >{item.records?.length}</td>
                                    <td >{totalPlaylistTime(item.records)}</td>
                                    <td><BoxItem data={boxData} /></td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.createdBy}</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => navigate(`/playlist/detail/${item.docId}`)}
                                    >Chi tiết</td>
                                </tr>
                            )
                        })}
                    </Table>
                    : <GridView
                        type="playlist"
                        data={currentItems}
                        paginate={{
                            dataForPaginate: playList,
                            setCurrentItems: handleCurrentItems
                        }}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleItemsPerPage}
                        handleClick={handlePlaylistClick}
                    />}
                <ActionBar>
                    <ActionBarItem
                        icon={images.addPlaylistIcon}
                        title="Thêm Playlist"
                        onClick={() => navigate(routes.AddPlaylistPage)}
                    />
                </ActionBar>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default PlayListPage;