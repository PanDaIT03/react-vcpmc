import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { AudioDialog } from "~/components/AudioDialog";
import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Dialog } from "~/components/Dialog";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { IOptionMenu, OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { CB_FORMAT, CB_PLAYLIST, getTotalMoment } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { addPlaylistRecordsAction } from "~/state/thunk/record";
import { IGlobalConstantsType, IRecord } from "~/types";
import { IPLaylist } from "~/types/PlaylistType";

import styles from "~/sass/AddPlaylistRecord.module.scss";
import { Filter } from "~/components/Filter";
const cx = classNames.bind(styles);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Playlist',
        to: routes.PlaylistPage
    }, {
        title: 'Thêm playlist mới',
        to: routes.AddPlaylistPage
    }, {
        title: 'Thêm bản ghi vào playlist',
        to: "#"
    }
];

const initialState = {
    id: 0,
    title: ''
};

const initialPlaylist: Omit<IPLaylist, "playlistsRecordsId"> = {
    docId: "",
    categoriesId: [],
    records: [],
    createdBy: "",
    createdDate: "",
    description: "",
    imageURL: "",
    mode: "",
    title: "",
    categories: [],
};

function AddPlaylistRecordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fromPage = localStorage.getItem("fromPage");

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [audioSource, setAudioSource] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [filter, setFilter] = useState<IOptionMenu[]>([]);
    const [search, setSearch] = useState<Pick<IGlobalConstantsType, "tag">>({});
    const [formatOption, setFormatOption] = useState<IGlobalConstantsType>(initialState);
    const [playlistOption, setPlaylistOption] = useState<IGlobalConstantsType>(CB_PLAYLIST[0]);

    const { playList, loading } = useSelector((state: RootState) => state.playlist);
    const { newRecords } = useSelector((state: RootState) => state.record);

    const [records, setRecords] = useState<IRecord[]>([]);
    const [newPlaylistRecords, setNewPlaylistRecords] = useState<IRecord[]>([]);

    useEffect(() => {
        setActive(false);
        setFilter([
            {
                title: "Thể loại",
                data: CB_FORMAT,
                setState: setFormatOption
            }, {
                title: "Playlist mẫu",
                boxSize: "small-pl",
                data: CB_PLAYLIST,
                setState: setPlaylistOption
            }
        ]);
    }, []);

    useEffect(() => {
        setSearch({
            tag: <Input
                id="search"
                type='text'
                name='search'
                size="custom"
                placeholder="Tên bản ghi, ca sĩ..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        });
    }, [searchValue]);

    useEffect(() => {
        if (playList.length <= 0)
            navigate(routes.PlaylistPage);
    }, [playList]);

    useEffect(() => {
        setNewPlaylistRecords(newRecords || []);
    }, [newRecords]);

    useEffect(() => {
        if (!visible) setAudioSource('');
    }, [visible]);

    useEffect(() => {
        let playlistOptionValue = playlistOption.title?.trim();

        let playlistMatch = playList.find(item => item.title === playlistOptionValue) || initialPlaylist;
        setRecords(playlistMatch.records);
    }, [playlistOption]);

    const handleAddRecords = (item: IRecord) => {
        let isExisted = newPlaylistRecords.filter(newRecord => item.nameRecord === newRecord.nameRecord).length > 0;
        if (!isExisted) setNewPlaylistRecords(prev => [...prev, item]);
    };

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title="Thêm bản ghi"
                paging={PAGING_ITEMS}
            >
                <div className={cx("container")}>
                    <div className={cx("container-left")}>
                        <h2 className={cx("title")}>Kho bản ghi</h2>
                        <Filter
                            data={filter}
                            className={cx("filter")}
                            search={search} searchPosition="bottom"
                        />
                        <Table
                            minWidth="100%"
                            className={cx("playlist-records")}
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả"]}
                        >
                            {records.map((record, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{record.nameRecord}</td>
                                    <td>{record.singer}</td>
                                    <td>{record.author}</td>
                                    <td
                                        className={cx("action")}
                                        onClick={() => {
                                            setVisible(true);
                                            setAudioSource(record.audioLink);
                                        }}
                                    >Nghe</td>
                                    <td
                                        className={cx("action")}
                                        onClick={() => handleAddRecords(record)}
                                    >Thêm</td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    <div className={cx("container-right")}>
                        <h2 className={cx("title")}>Danh sách bản ghi được thêm vào Playlist</h2>
                        <div className={cx("total")}>
                            <div className={cx("total-record")}>
                                <div className={cx("title")}>Tổng số:</div>
                                <div className={cx("content")}>{newPlaylistRecords.length} bản ghi</div>
                            </div>
                            <div className={cx("total-time")}>
                                <div className={cx("title")}>Tổng thời lượng:</div>
                                <div className={cx("content")}>
                                    {newPlaylistRecords.length > 0
                                        ? totalPlaylistTime(newPlaylistRecords)
                                        : <p>--:--:--</p>}
                                </div>
                            </div>
                        </div>
                        <div className={cx("search")}>
                            <Input
                                id="search"
                                type='text'
                                name='search'
                                size="custom"
                                value={searchValue}
                                placeholder="Tên bản ghi, ca sĩ..."
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <Table
                            minWidth="100%"
                            className={cx("playlist-records")}
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả"]}
                        >
                            {newPlaylistRecords.length <= 0
                                ? <tr>
                                    <td
                                        className={cx("reminder")}
                                        colSpan={4}
                                    >
                                        <div className={cx("content")}>
                                            <p>Vui lòng chọn bản ghi để thêm vào Playlist</p>
                                            <img src={images.force} alt="force" />
                                        </div>
                                    </td>
                                </tr>
                                : newPlaylistRecords.map((record, index) => (
                                    <tr key={record.docId}>
                                        <td>{index + 1}</td>
                                        <td>{record.nameRecord}</td>
                                        <td>{record.singer}</td>
                                        <td>{record.author}</td>
                                        <td
                                            className={cx("action")}
                                            onClick={() => {
                                                setVisible(true);
                                                setAudioSource(record.audioLink);
                                            }}
                                        >Nghe</td>
                                        <td
                                            className={cx("action")}
                                            onClick={() => setNewPlaylistRecords(newPlaylistRecords.filter(item => item.nameRecord !== record.nameRecord))}
                                        >Gỡ</td>
                                    </tr>
                                ))}
                        </Table>
                    </div>
                </div>
                <Dialog
                    primary
                    visible={visible}
                    content="audio"
                    alignCenter="all"
                >
                    <AudioDialog
                        source={audioSource}
                        setVisible={setVisible}
                    />
                </Dialog>
                <div className={cx("button-actions")}>
                    <Button
                        primary
                        size="large"
                        value="Huỷ"
                        onClick={() => navigate(routes.AddPlaylistPage)}
                    />
                    <Button
                        primary
                        size="large"
                        fill
                        value="Lưu"
                        buttonType="submit"
                        onClick={() =>
                            dispatch(addPlaylistRecordsAction(newPlaylistRecords))
                                .then(() => navigate(fromPage ?? routes.PlaylistPage))
                        }
                    />
                </div>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default AddPlaylistRecordPage;