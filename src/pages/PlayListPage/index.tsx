import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { Input } from "~/components/Input";
import { Table } from "~/components/Table";
import { CommonWrapper } from "~/components/CommonWrapper";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { SwitchViewButton } from "~/components/SwitchViewButtons";
import { RootState, useAppDispatch } from "~/state";
import { getPlayListAction } from "~/state/thunk/playlist";
import { IGlobalConstantsType, IRecord } from "~/types";
import { getTotalMoment } from "~/constants";
import { BoxItem } from "~/components/BoxItem";
import { GridView } from "~/components/GridView";
import { Loading } from "~/components/Loading";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";

import styles from "~/sass/PlayList.module.scss";
const cx = classNames.bind(styles);

function PlayListPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive } = useContext(SidebarContext);
    const [isGridView, setIsGridView] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const playlistState = useSelector((state: RootState) => state.playlist);
    const { playList, loading } = playlistState;

    const handleClickSearch = () => { };

    useEffect(() => {
        dispatch(getPlayListAction());
        setActive(true);
    }, []);

    useEffect(() => {
        console.log(playList);
    }, [playList]);

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title="Playlist"
            >
                <div className={cx("action")}>
                    <div className={cx("search")}>
                        <Input
                            id="search"
                            name="search"
                            value={searchValue}
                            placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                            size="custom"
                            iconRight={images.search}
                            onChange={(event) => setSearchValue(event.target.value)}
                            onIconRightClick={handleClickSearch}
                        />
                    </div>
                    <SwitchViewButton state={isGridView} setState={setIsGridView} />
                </div>
                {!isGridView
                    ? <Table
                        thead={["STT", "Tiêu đề", "Số bản ghi", "Thời lượng", "Chủ đề", "Ngày tạo", "Người tạo", ""]}
                        className={cx("playlist")}
                    >
                        {playList.map((item, index) => {
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
                        data={playList}
                        type="playlist"
                        handleClick={() => console.log("clicked")}
                    />}
                <ActionBar visible={true}>
                    <ActionBarItem
                        icon={images.addPlaylistIcon}
                        title="Thêm Playlist"
                    />
                </ActionBar>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default PlayListPage;